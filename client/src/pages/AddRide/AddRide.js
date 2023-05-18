import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  import './AddRide.css'
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  
  const center = { lat: 18.4575 , lng: 73.8508 }
  function App({P2P,curAcc}) {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyB6unuMqmS1jJPVAyA8jpvxJMuiCV8Wkwk",
      libraries: ['places'],
    })
  
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [source, setSource] = useState('')
    const [destination, setDestination] = useState('')
    const [fare, setFare] = useState()
    const [fareinWei,setFareinWei] = useState();

    const calculateDifferentCharges = async (
      distance,
      baseKilometers,
      chargePerKm,
      changedChargePerKm,
      duration,
      rideTimeCharge,
      basePrice,
      basePriceKilometers,
      serviceTax,
      nightCharges
    ) => {
      // Charge on distance
      let chargeOnDistance = 0;
      if (distance > baseKilometers) {
        chargeOnDistance = baseKilometers * chargePerKm;
        chargeOnDistance += (distance - baseKilometers) * changedChargePerKm;
      } else {
        chargeOnDistance = distance * chargePerKm;
      }
  
      // Charge on time
      let chargeOnTime = duration * rideTimeCharge;
  
      // Base price charge
      let basePriceCharge = basePrice * basePriceKilometers;
  
      let totalFare = chargeOnDistance + chargeOnTime + basePriceCharge;
  
      // Serice charge
      totalFare +=
        (chargeOnDistance + chargeOnTime + basePriceCharge) * (serviceTax / 100);
  
        // Night fare charge if applicable
        if(nightCharges > 0){
          totalFare *= nightCharges;
        }
  
      return totalFare;
    };
    
    

    const calculateCabFare = async (cabType, distance, duration) => {
      const serviceTax = 5.6; // In Percentage, charged at the total fare
      const baseKilometers = 20; // In Kiloneters, after 20 kilometers charge/kilometer will be increased
      const basePriceKilometers = 5; // In Kilometers, after 5 Kms base price will not be charged
      const rideTimeCharge = 1; // In rupees, for every minute you will be charged a rupee
  
      distance = distance && parseFloat(distance.replace(/,/g, '').split(' ')[0]);
  
      if (duration && duration.includes('h')) {
        // if duration is more then or equal to 1 hr
        duration =
          parseInt(duration.split(' ')[0]) * 60 +
          parseInt(duration.split(' ')[2]);
      } else {
        duration = parseInt(duration.split(' ')[0]);
      }
  
      let nightCharges = 0; // Initially default night charges are 0
      const currentDate = await new Date();
      const currentTime = await [currentDate.getHours(), currentDate.getMinutes()];
  
      // Night charges are applicable from 10 PM to 5 AM
      if (currentTime[0] <= 5 || currentTime[0] === 22 || currentTime[0] === 23) {
        if (currentTime[1] < 30) {
          currentTime[1] = 0;
        }
        else {
          if (currentTime[0] === 23) {
            currentTime[0] = 0;
            currentTime[1] = 0;
          }
          else {
            currentTime[1] = 1;
          }
        }
  
        nightCharges += currentTime[0] + currentTime[1];
      }
  
      const chargePerKmMini = 11;
      const changedChargePerKMini = 20; // Charge after baseKilometers
      const basePriceMini = 50;

      const totalFareMini = await calculateDifferentCharges(
        distance,
        baseKilometers,
        chargePerKmMini,
        changedChargePerKMini,
        duration,
        rideTimeCharge,
        basePriceMini,
        basePriceKilometers,
        serviceTax,
        nightCharges
      );
      // console.log(totalFareMini);
      return `${Math.floor(totalFareMini)}`;
    };




    const handlePostRide = (e) => {
      e.preventDefault();
      console.log("inside Post Ride");
      
      let rideDetails = source + "#" + destination + "#" +distance + "#" + duration+"#"+fare;
      console.log(rideDetails);
      P2P.methods.postRide(rideDetails).send({ from: curAcc }).on("transactionHash", (hash) => {
          
          console.log("RIDE POSTED");
        }).catch((err) => {
          console.log("Error: Message: " + err.message);
        });
    };


    
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
  
    if (!isLoaded) {
      return <SkeletonText />
    }
  
    async function calculateRoute() {
      if (originRef.current.value === '' || destiantionRef.current.value === '') {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destiantionRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,

      })
      ;
      calculateCabFare(2,distance,duration).then(response=>{
        console.log(response);
        setFare(response);
      })
      
      
      setDirectionsResponse(results)
      setSource(originRef.current.value)
      setDestination(destiantionRef.current.value)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    }
  
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destiantionRef.current.value = ''
    }
  
    return (
      <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        className ='browser-default'
        h='100vh'
        w='100vw'
      >
        <Box position='absolute' left={0} top={0} h='100%' w='100%'>
          {/* Google Map Box */}
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={map => setMap(map)}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        <div className="container">
          
          <div className="row">
           
          </div>
        </div>
        <Box
          p={4}
          borderRadius='lg'
          m={4}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <div className='mainbox'>

          
          <HStack spacing={2} justifyContent='space-between'>
            <div className="row">
              <div className="col s12">
                <Box flexGrow={1}>
                  <Autocomplete>
                    <Input type='text' placeholder='Origin' ref={originRef} />
                  </Autocomplete>
                </Box>
              </div>
              <div className="col s12">
                <Box flexGrow={1}>
                  <Autocomplete>
                    <Input
                      type='text'
                      placeholder='Destination'
                      ref={destiantionRef}
                    />
                  </Autocomplete>
                </Box>
              </div>
              
            </div>
            
            
  
          </HStack>
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text><h6 className='s12'><strong className="blue-text">Distance: {distance}</strong></h6></Text>
            <Text><h6><strong className="red-text">Duration: {duration}</strong></h6></Text>
            
            <div className = "btn-floating btn-small waves-effect waves-light orange lighten-2" onClick={clearRoute}>
              <i class="material-icons">cached</i>
            </div>
            
             
          </HStack>
          <HStack spacing={2} mt={4} justifyContent='space-between'>
            <Text><h6><strong className="green-text">Fare : ₹ {fare}</strong></h6></Text>
            <ButtonGroup>
              <div className="btn-small" type='submit' onClick={calculateRoute}>
                  Calculate Route
              </div>
              <div className="btn-small" type='submit' onClick={handlePostRide}>
                Post Ride
              </div>
              
              
            </ButtonGroup>
            
          </HStack>
          </div>
        </Box>
      </Flex>
    )
  }
  
  export default App
  