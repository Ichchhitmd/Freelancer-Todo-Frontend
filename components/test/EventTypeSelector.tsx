import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated, Easing, StyleSheet } from 'react-native';

interface EventType {
  id: number;
  name: string;
}

interface EventTypeSelectorProps {
  eventTypes: EventType[];
  initialSelectedId?: number;
  onSelectEventType: (id: number) => void;
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  eventTypes,
  initialSelectedId,
  onSelectEventType,
}) => {
  const ITEM_HEIGHT = 60;
  const VISIBLE_ITEMS = 3;
  const SCROLL_VIEW_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
  const SELECTOR_PADDING = (SCROLL_VIEW_HEIGHT - ITEM_HEIGHT) / 2;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef<ScrollView>(null);

  const snapToNearest = useCallback(() => {
    if (scrollViewRef.current) {
      const currentOffset = scrollY.__getValue();
      const nearestIndex = Math.round(currentOffset / ITEM_HEIGHT);
      const safeIndex = Math.max(0, Math.min(nearestIndex, eventTypes.length - 1));

      Animated.timing(scrollY, {
        toValue: safeIndex * ITEM_HEIGHT,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (safeIndex !== selectedIndex) {
          setSelectedIndex(safeIndex);
          onSelectEventType(eventTypes[safeIndex].id);
        }
      });
    }
  }, [eventTypes, onSelectEventType, scrollY, selectedIndex]);

  const handleScrollEnd = useCallback(() => {
    snapToNearest();
  }, [snapToNearest]);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
  });

  useEffect(() => {
    if (eventTypes.length > 0) {
      const initialIndex = initialSelectedId
        ? eventTypes.findIndex((t) => t.id === initialSelectedId)
        : 0;

      if (initialIndex !== -1) {
        setSelectedIndex(initialIndex);
        scrollY.setValue(initialIndex * ITEM_HEIGHT);

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: initialIndex * ITEM_HEIGHT,
            animated: false,
          });
        }, 0);
      } else {
        setSelectedIndex(0);
        scrollY.setValue(0);

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
      }
    }
  }, [initialSelectedId, eventTypes, scrollY]);

  return (
    <View
      style={[
        styles.container,
        {
          height: SCROLL_VIEW_HEIGHT,
          overflow: 'hidden',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'black',
        },
      ]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        nestedScrollEnabled
        contentContainerStyle={{
          paddingTop: SELECTOR_PADDING,
          paddingBottom: SELECTOR_PADDING,
        }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEnabled>
        {eventTypes.map((type, index) => {
          const isSelected = selectedIndex === index;
          return (
            <View
              key={type.id}
              style={[
                styles.itemContainer,
                isSelected ? styles.selectedItem : styles.unselectedItem,
              ]}>
              <Text
                style={[styles.itemText, isSelected ? styles.selectedText : styles.unselectedText]}>
                {type.name}
              </Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  itemContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#D92323',
    color: 'white',
  },
  unselectedItem: {
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: 'black',
  },
});

export default EventTypeSelector;
