/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import ExhibitDetail from './src/components/ExhibitDetail';
import BottomTabBar from './src/components/BottomTabBar';
import {FlatList} from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const {width, height} = Dimensions.get('window');
console.log('height', height);

const bannerData = [
  {
    id: 1,
    color: '#0066cc',
    title: "Don't miss our\ndaily Dive Feeding!",
  },
  {
    id: 2,
    color: '#4CAF50',
    title: 'Meet our\nNew Sharks!',
  },
  {
    id: 3,
    color: '#FF5722',
    title: 'Special\nHoliday Events',
  },
];

const showData = [
  {
    id: 1,
    time: '2:30 PM',
    title: 'Dive Feeding @ Shipwreck',
  },
  {
    id: 2,
    time: '2:30 PM',
    title: 'Dive Feeding @ Shipwreck',
  },
  {
    id: 3,
    time: '2:30 PM',
    title: 'Dive Feeding @ Shipwreck',
  },
];

const ShowCard = ({title, time}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const lottieRef = useRef(null);

  const handlePress = () => {
    setIsPlaying(prev => !prev);
    if (lottieRef.current) {
      if (!isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.reset();
        lottieRef.current.pause();
      }
    }
  };

  return (
    <View style={styles.showCard}>
      <TouchableOpacity
        style={styles.showImageContainer}
        onPress={handlePress}
        activeOpacity={0.8}>
        <View style={[styles.showImageContainer]}>
          <LottieView
            ref={lottieRef}
            source={require('./src/assets/Animation - 1740331834031.json')}
            style={{
              width: '100%',
              height: '100%',
            }}
            autoPlay={false}
            loop={true}
            speed={1}
            onAnimationFailure={error =>
              console.warn('Animation failed:', error)
            }
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.showTime}>{time}</Text>
      <Text style={styles.showTitle}>{title}</Text>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const timerRef = useRef(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(offset / slideSize);
    setActiveSlide(activeIndex);
  };

  const scrollToNextSlide = useCallback(() => {
    if (scrollViewRef.current) {
      const nextSlide = (activeSlide + 1) % bannerData.length;
      scrollViewRef.current.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
      setActiveSlide(nextSlide);
    }
  }, [activeSlide]);

  useEffect(() => {
    // Start auto-sliding
    timerRef.current = setInterval(scrollToNextSlide, 3000);

    // Create enhanced blinking animation
    const blink = Animated.sequence([
      Animated.parallel([
        Animated.timing(blinkAnim, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Run the blinking animation in a loop with delay between cycles
    Animated.loop(
      Animated.sequence([
        blink,
        Animated.delay(1000), // Add 1 second pause between blinks
      ]),
    ).start();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      blinkAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, [scrollToNextSlide, blinkAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require('./src/assets/Leading-icon.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Image
            source={require('./src/assets/sealogo.png')}
            style={styles.logo}
          />
          <TouchableOpacity>
            <Image
              source={require('./src/assets/On.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContent}>
          {/* Hero Image/Carousel */}
          <View style={styles.heroContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onTouchStart={() => {
                // Clear interval when user touches the slider
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
              }}
              onTouchEnd={() => {
                // Restart interval when user stops touching
                timerRef.current = setInterval(scrollToNextSlide, 3000);
              }}>
              {bannerData.map((banner, index) => (
                <View
                  key={banner.id}
                  style={[styles.heroSlide, {backgroundColor: banner.color}]}>
                  <Text style={styles.heroText}>{banner.title}</Text>
                </View>
              ))}
            </ScrollView>
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {bannerData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeSlide && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Navigation Icons */}
          <View style={styles.navGrid}>
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.navItem}>
                <View style={[styles.navIcon, {backgroundColor: '#f0f0f0'}]}>
                  <Image
                    source={require('./src/assets/Group342.png')}
                    style={styles.notificationIcon}
                  />
                </View>
                <Text style={styles.navText}>Map</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ExhibitDetail')}>
                <Animated.View
                  style={[
                    styles.navIcon,
                    {
                      backgroundColor: '#f0f0f0',
                      transform: [{scale: scaleAnim}],
                    },
                  ]}>
                  <Image
                    source={require('./src/assets/Group342-2.png')}
                    style={styles.notificationIcon}
                  />
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.navText,
                    {
                      color: blinkAnim.interpolate({
                        inputRange: [0.6, 1],
                        outputRange: ['#007AFF', '#666'],
                      }),
                      transform: [{scale: scaleAnim}],
                    },
                  ]}>
                  Inhabitants
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <View style={[styles.navIcon, {backgroundColor: '#f0f0f0'}]}>
                  <Image
                    source={require('./src/assets/Group341.png')}
                    style={styles.notificationIcon}
                  />
                </View>
                <Text style={styles.navText}>Shows</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <View style={[styles.navIcon, {backgroundColor: '#f0f0f0'}]}>
                  <Image
                    source={require('./src/assets/Group275.png')}
                    style={styles.notificationIcon}
                  />
                </View>
                <Text style={styles.navText}>Shopping</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.navRowBottom}>
              <TouchableOpacity style={styles.navItem}>
                <View style={[styles.navIcon, {backgroundColor: '#f0f0f0'}]}>
                  <Image
                    source={require('./src/assets/Group310.png')}
                    style={styles.notificationIcon}
                  />
                </View>
                <Text style={styles.navText}>Dine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <View style={[styles.navIcon, {backgroundColor: '#f0f0f0'}]}>
                  <Image
                    source={require('./src/assets/logo.png')}
                    style={styles.notificationIcon}
                  />
                </View>
                <Text style={styles.navText}>Meet & Greets</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tickets Section */}
          <View style={styles.ticketsSection}>
            <View style={styles.ticketBox}>
              <Text style={styles.ticketTitle}>My e-tickets</Text>
              <Text style={styles.ticketSubtext}>There aren't any yet.</Text>
              <TouchableOpacity>
                <Text style={styles.ticketLink}>Retrieve here</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.parkHoursBox}>
              <Text style={styles.parkHoursTitle}>Today, 13 Feb</Text>
              <Text style={styles.parkHoursTime}>10am - 5pm</Text>
              <TouchableOpacity>
                <Text style={styles.parkHoursLink}>Plan my visit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shows Section */}
          <View style={styles.showsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Shows</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllLink}>View all</Text>
              </TouchableOpacity>
            </View>

            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ShowCard time="2:30 PM" title="Dive Feeding @ Shipwreck" />
              <ShowCard time="2:40 PM" title="Say Cheese Shark" />
              <ShowCard time="2:40 PM" title="Say Cheese Shark" />
              <ShowCard time="2:40 PM" title="Say Cheese Shark" />
              <ShowCard time="2:40 PM" title="Say Cheese Shark" />
            </ScrollView> */}

            <FlatList
              data={showData}
              renderItem={({item}) => (
                <ShowCard time={item.time} title={item.title} />
              )}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              // style={{paddingHorizontal: 20}}
              contentContainerStyle={{paddingLeft: 20}}
            />
          </View>
        </ScrollView>
        <BottomTabBar />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ExhibitDetail" component={ExhibitDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,

    // backgroundColor: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 24,
    height: 24,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  heroContainer: {
    position: 'relative',
    height: 200,
  },
  heroSlide: {
    width: width,
    height: 200,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  navGrid: {
    padding: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',

    marginBottom: 20,
  },
  navRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'left',
    // flex: 1,
    marginBottom: 20,
    // backgroundColor: 'blue',
    width: '52%',
    // paddingLeft: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  ticketsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  ticketBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ticketSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ticketLink: {
    color: '#007AFF',
    fontSize: 14,
  },
  parkHoursBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  parkHoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  parkHoursTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  parkHoursLink: {
    color: '#007AFF',
    fontSize: 14,
  },
  showsSection: {
    // padding: 20,
    // backgroundColor: 'blue',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllLink: {
    color: '#007AFF',
    fontSize: 14,
  },
  showCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  showImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#0066cc',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 12,
  },
  showImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  showTime: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  showTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    paddingHorizontal: 8,
  },
});

export default App;
