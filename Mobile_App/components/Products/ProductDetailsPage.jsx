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
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// ── Import all 3 stores ───────────────────────────────────────
import useBuyStore from "@/store/useBuyStore";
import useRentStore from "@/store/useRentStore";
import useLostFoundStore from "@/store/useLostFoundStore";

const { width, height } = Dimensions.get("window");
const IMG_HEIGHT = width * 0.78;

// ── Hook that picks the right store based on page type ────────
function useProductStore(page) {
  const buy = useBuyStore();
  const rent = useRentStore();
  const lostFound = useLostFoundStore();

  if (page === "rent")
    return {
      product: rent.selectedProduct,
      fetchById: rent.fetchProductById,
      isLoading: rent.isLoading,
    };
  if (page === "lost-found")
    return {
      product: lostFound.selectedItem,
      fetchById: lostFound.fetchItemById,
      isLoading: lostFound.isLoading,
    };
  // default → buy
  return {
    product: buy.selectedProduct,
    fetchById: buy.fetchProductById,
    isLoading: buy.isLoading,
  };
}

// ─────────────────────────────────────────────────────────────
// Usage in your route files:
//
//   app/buy/[id].jsx
//     export default function BuyDetail() { return <ProductDetailScreen page="buy" />; }
//
//   app/rent/[id].jsx
//     export default function RentDetail() { return <ProductDetailScreen page="rent" />; }
//
//   app/lost-found/[id].jsx
//     export default function LostFoundDetail() { return <ProductDetailScreen page="lost-found" />; }
// ─────────────────────────────────────────────────────────────
export default function ProductDetailScreen({ page = "buy" }) {
  // ✅ Fix 1: id comes ONLY from useLocalSearchParams, not from props
  const { id } = useLocalSearchParams();
  console.log(id);

  const { product, fetchById, isLoading } = useProductStore(page);

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

  useEffect(() => {
    if (id) fetchById(id); // uses cache if available, else fetches from API
  }, [id]);

  // ✅ Fix 2: guard against null product while loading
  const isLostFound = page === "lost-found";
  const images =
    product?.image_urls?.length > 0
      ? product.image_urls
      : ["https://picsum.photos/seed/default/800/600"];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxVisible(true);
    Animated.timing(lightboxAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      lightboxRef.current?.scrollToOffset({
        offset: index * width,
        animated: false,
      });
    }, 50);
  };

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

  const handleContact = () => {
    Alert.alert("Contact Seller", `Reach out to ${product?.seller}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "WhatsApp",
        onPress: () =>
          Linking.openURL(`whatsapp://send?phone=${product?.phone ?? ""}`),
      },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${product?.phone ?? ""}`),
      },
    ]);
  };

  const onCarouselScroll = (e) => {
    setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const onLightboxScroll = (e) => {
    setLightboxIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const scrollToImage = (index) => {
    carouselRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    setActiveImg(index);
  };

  // ✅ Fix 3: show loading spinner while product is being fetched
  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0088ff" />
        <LinearGradient
          colors={["#c3b5b0", "#0088ff"]}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          style={styles.loadingBackBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const badgeColor =
    product.type === "SELL"
      ? "#0088ff"
      : product.type === "RENT"
        ? "#00aacc"
        : "#6B7280";

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
                {index === 0 && (
                  <View style={styles.tapHint}>
                    <Ionicons name="expand-outline" size={13} color="#fff" />
                    <Text style={styles.tapHintText}>Tap to enlarge</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.45)", "transparent"]}
            style={styles.imgTopGradient}
            pointerEvents="none"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imgBottomGradient}
            pointerEvents="none"
          />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

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

          <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.typeBadgeText}>{product.type}</Text>
          </View>

          {images.length > 1 && (
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {activeImg + 1} / {images.length}
              </Text>
            </View>
          )}

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
          <View style={styles.metaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{product.category}</Text>
            </View>
            {product.created_at && (
              <Text style={styles.dateText}>
                <Ionicons name="time-outline" size={12} color="#8E8E9A" />{" "}
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : null}
              </Text>
            )}
          </View>

          <Text style={styles.title}>{product.title ?? product.name}</Text>

          {/* Price — hidden for lost & found */}
          {!isLostFound &&
            (product.price != null || product.price_per_day != null) && (
              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  ₹
                  {Number(
                    product.price || product.price_per_day,
                  ).toLocaleString("en-IN")}
                </Text>
                {product.type === "RENT" && (
                  <Text style={styles.rentLabel}> / day</Text>
                )}
              </View>
            )}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            {product.description ?? "No description provided."}
          </Text>

          <View style={styles.divider} />

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
            {product.location && (
              <DetailItem
                icon="location-outline"
                label="Location"
                value={product.location}
              />
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>
            {isLostFound ? "Reported By" : "Seller"}
          </Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {product.seller_name
                  ? product.seller_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.seller_name}</Text>
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
            <Text style={styles.contactBtnText}>
              {isLostFound ? "I Found / I Lost This" : "Contact Seller"}
            </Text>
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
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={closeLightbox}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.lightboxCounter}>
            <Text style={styles.lightboxCounterText}>
              {lightboxIndex + 1} / {images.length}
            </Text>
          </View>

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

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingBackBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#fff", fontSize: 14, fontWeight: "600" },

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

  infoCard: { backgroundColor: "#fff", marginTop: 0, padding: 22 },
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
  lightboxImg: { width, height: height * 0.75 },
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
