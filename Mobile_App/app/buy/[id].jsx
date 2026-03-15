import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Image,
  FlatList,
  Modal,
  Linking,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const IMG_HEIGHT = width * 0.78;

export default function ProductDetailScreen() {
  const { item } = useLocalSearchParams();
  const product = item ? JSON.parse(item) : {};
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const lightboxAnim = useRef(new Animated.Value(0)).current;

  const carouselRef = useRef(null);
  const lightboxRef = useRef(null);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://picsum.photos/seed/default/800/600"];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Open lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxVisible(true);
    Animated.timing(lightboxAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    // Scroll lightbox to correct image
    setTimeout(() => {
      lightboxRef.current?.scrollToOffset({
        offset: index * width,
        animated: false,
      });
    }, 50);
  };

  // Close lightbox
  const closeLightbox = () => {
    Animated.timing(lightboxAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setLightboxVisible(false));
  };

  const toggleWishlist = () => {
    Animated.sequence([
      Animated.spring(heartAnim, {
        toValue: 1.4,
        speed: 40,
        useNativeDriver: true,
      }),
      Animated.spring(heartAnim, {
        toValue: 1,
        speed: 40,
        useNativeDriver: true,
      }),
    ]).start();
    setWishlist((prev) => !prev);
  };
  // ---------------------------------------TODO: Replace with in-app chat or email composer---------------------------------------------
  const handleContact = () => {
    Alert.alert("Contact Seller", `Reach out to ${product.seller}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "WhatsApp",
        onPress: () =>
          Linking.openURL(`whatsapp://send?phone=${product.phone || ""}`),
      },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${product.phone || ""}`),
      },
    ]);
  };

  // Track scroll position → update active dot
  const onCarouselScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveImg(index);
  };

  const onLightboxScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setLightboxIndex(index);
  };

  // Tap a dot → scroll carousel
  const scrollToImage = (index) => {
    carouselRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    setActiveImg(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Image Carousel ───────────────────── */}
        <View style={styles.imgContainer}>
          <FlatList
            ref={carouselRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item: uri, index }) => (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => openLightbox(index)}
                style={styles.carouselItem}
              >
                <Image
                  source={{ uri }}
                  style={styles.mainImg}
                  resizeMode="cover"
                />
                {/* Tap hint on first load */}
                {index === 0 && (
                  <View style={styles.tapHint}>
                    <Ionicons name="expand-outline" size={13} color="#fff" />
                    <Text style={styles.tapHintText}>Tap to enlarge</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />

          {/* Top gradient */}
          <LinearGradient
            colors={["rgba(0,0,0,0.45)", "transparent"]}
            style={styles.imgTopGradient}
            pointerEvents="none"
          />

          {/* Bottom gradient */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imgBottomGradient}
            pointerEvents="none"
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Wishlist button */}
          <Animated.View
            style={[styles.wishBtn, { transform: [{ scale: heartAnim }] }]}
          >
            <TouchableOpacity onPress={toggleWishlist}>
              <Ionicons
                name={wishlist ? "heart" : "heart-outline"}
                size={22}
                color={wishlist ? "#FF4D4D" : "#fff"}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Type badge */}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  product.type === "SELL" ? "#0088ff" : "#00C48C",
              },
            ]}
          >
            <Text style={styles.typeBadgeText}>{product.type}</Text>
          </View>

          {/* Image counter badge */}
          {images.length > 1 && (
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {activeImg + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => scrollToImage(i)}>
                  <Animated.View
                    style={[styles.dot, i === activeImg && styles.dotActive]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <View style={styles.thumbRow}>
            {images.map((uri, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  scrollToImage(i);
                  openLightbox(i);
                }}
                style={[
                  styles.thumbWrap,
                  i === activeImg && styles.thumbWrapActive,
                ]}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
                {i === activeImg && <View style={styles.thumbActiveLine} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Product Info Card ─────────────────── */}
        <Animated.View
          style={[
            styles.infoCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Category + Date */}
          <View style={styles.metaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{product.category}</Text>
            </View>
            {product.createdAt && (
              <Text style={styles.dateText}>
                <Ionicons name="time-outline" size={12} color="#8E8E9A" />{" "}
                {product.createdAt}
              </Text>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title || product.name}</Text>

          {/* Price */}
          {product.type !== "LOST/FOUND" && (
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </Text>
              {product.type === "RENT" && (
                <Text style={styles.rentLabel}> / day</Text>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            {product.description || "No description provided."}
          </Text>

          <View style={styles.divider} />

          {/* Details grid */}
          <Text style={styles.sectionLabel}>Details</Text>
          <View style={styles.detailsGrid}>
            <DetailItem
              icon="grid-outline"
              label="Category"
              value={product.category}
            />
            <DetailItem
              icon="swap-horizontal-outline"
              label="Type"
              value={product.type}
            />
            <DetailItem
              icon="school-outline"
              label="College"
              value={product.college}
            />
            {/* {product.id && (
              <DetailItem
                icon="finger-print-outline"
                label="Item ID"
                value={product.id.slice(0, 12) + "..."}
                mono
              />
            )} */}
          </View>

          <View style={styles.divider} />

          {/* Seller */}
          {product.type !== "LOST/FOUND" && (
            <Text style={styles.sectionLabel}>Seller</Text>
          )}
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {product.seller
                  ? product.seller
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.seller}</Text>
              <Text style={styles.sellerCollege}>{product.college}</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Ionicons name="shield-checkmark" size={13} color="#00C48C" />
              <Text style={styles.verifiedTagText}>Verified</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Bottom CTA Bar ────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.wishlistBarBtn}
          onPress={toggleWishlist}
        >
          <Ionicons
            name={wishlist ? "heart" : "heart-outline"}
            size={22}
            color={wishlist ? "#FF4D4D" : "#0088ff"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={handleContact}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={["#54d5eb", "#0088ff"]}
            style={styles.contactGradient}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.contactBtnText}>Contact</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Lightbox Modal ────────────────────── */}
      <Modal
        visible={lightboxVisible}
        transparent
        statusBarTranslucent
        animationType="none"
      >
        <Animated.View
          style={[
            styles.lightbox,
            {
              opacity: lightboxAnim,
              transform: [
                {
                  scale: lightboxAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={closeLightbox}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Counter */}
          <View style={styles.lightboxCounter}>
            <Text style={styles.lightboxCounterText}>
              {lightboxIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Swipeable full images */}
          <FlatList
            ref={lightboxRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onLightboxScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item: uri }) => (
              <View style={styles.lightboxSlide}>
                <Image
                  source={{ uri }}
                  style={styles.lightboxImg}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {/* Bottom dots in lightbox */}
          {images.length > 1 && (
            <View style={styles.lightboxDots}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.lightboxDot,
                    i === lightboxIndex && styles.lightboxDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
}

// ── Sub components ─────────────────────────────────────────────
function DetailItem({ icon, label, value, mono }) {
  return (
    <View style={detailStyles.item}>
      <View style={detailStyles.iconBox}>
        <Ionicons name={icon} size={15} color="#0088ff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={detailStyles.label}>{label}</Text>
        <Text
          style={[detailStyles.value, mono && detailStyles.mono]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },

  // Carousel
  imgContainer: { width, height: IMG_HEIGHT, position: "relative" },
  carouselItem: { width, height: IMG_HEIGHT },
  mainImg: { width: "100%", height: "100%", backgroundColor: "#E8EBF0" },

  tapHint: {
    position: "absolute",
    bottom: 48,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tapHintText: { fontSize: 11, color: "#fff", fontWeight: "600" },

  imgTopGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  imgBottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },

  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  wishBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    left: 64,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },

  counterBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 48,
    right: 64,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  counterText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  dotsRow: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  dotActive: { backgroundColor: "#fff", width: 20, borderRadius: 4 },

  // Thumbnail strip
  thumbRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECE8",
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  thumbWrapActive: { borderColor: "#0088ff" },
  thumb: { width: "100%", height: "100%", backgroundColor: "#E8EBF0" },
  thumbActiveLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#0088ff",
  },

  // Info card
  infoCard: {
    backgroundColor: "#fff",
    marginTop: 0,
    padding: 22,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  categoryPillText: { fontSize: 11, fontWeight: "700", color: "#0088ff" },
  dateText: { fontSize: 12, color: "#8E8E9A", fontWeight: "500" },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A2E",
    lineHeight: 30,
    marginBottom: 10,
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 18 },
  price: { fontSize: 28, fontWeight: "900", color: "#0088ff" },
  rentLabel: { fontSize: 14, color: "#8E8E9A", fontWeight: "600" },

  divider: { height: 1, backgroundColor: "#F0ECE8", marginVertical: 18 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E9A",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  description: { fontSize: 14, color: "#4B5563", lineHeight: 22 },

  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    padding: 14,
  },
  sellerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0088ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sellerAvatarText: { fontSize: 16, fontWeight: "900", color: "#fff" },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: "800", color: "#1A1A2E" },
  sellerCollege: {
    fontSize: 12,
    color: "#8E8E9A",
    fontWeight: "500",
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,196,140,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedTagText: { fontSize: 11, fontWeight: "700", color: "#00C48C" },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0ECE8",
    shadowColor: "#0088ff",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    gap: 12,
  },
  wishlistBarBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  contactBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  contactGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
  },
  contactBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Lightbox
  lightbox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
  },
  lightboxClose: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  lightboxCounter: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 48,
    alignSelf: "center",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lightboxCounterText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  lightboxSlide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxImg: { width: width, height: height * 0.75 },
  lightboxDots: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  lightboxDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  lightboxDotActive: { backgroundColor: "#fff", width: 20, borderRadius: 4 },
});

const detailStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: (width - 44 - 10) / 2,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    color: "#8E8E9A",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: { fontSize: 13, color: "#1A1A2E", fontWeight: "700", marginTop: 1 },
  mono: {
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#8E8E9A",
  },
});
