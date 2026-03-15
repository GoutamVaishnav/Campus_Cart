import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  "All",
  "Books & Notes",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports & Fitness",
  "Stationery",
  "Kitchen & Appliances",
  "Cycles & Transport",
  "Other",
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹2,000", min: 500, max: 2000 },
  { label: "₹2,000 – ₹10,000", min: 2000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Latest First", key: "latest" },
  { label: "Price: Low to High", key: "price_asc" },
  { label: "Price: High to Low", key: "price_desc" },
];

// ─────────────────────────────────────────────────────────────
// PAGE CONFIG
// Drives the header title, detail route, and whether price
// filter makes sense (lost-found has no price).
// ─────────────────────────────────────────────────────────────
const PAGE_CONFIG = {
  buy: {
    title: "Buy Items",
    detailRoute: (id) => `/buy/${id}`, // browse detail
    hasPrice: true,
    typeColor: "#0088ff",
    typeIcon: "bag-handle-outline",
  },
  rent: {
    title: "Rent Items",
    detailRoute: (id) => `/rent/${id}`,
    hasPrice: true,
    typeColor: "#00aacc",
    typeIcon: "repeat-outline",
  },
  "lost-found": {
    title: "Lost & Found",
    detailRoute: (id) => `/lost-found/${id}`,
    hasPrice: false,
    typeColor: "#1A1A2E",
    typeIcon: "search-circle-outline",
  },
};

// ─────────────────────────────────────────────────────────────
// PROPS
//   PRODUCTS  — array of product objects
//   page      — "buy" | "rent" | "lost-found"
//   mode      — "browse" (public listing) | "manage" (my-listings)
// ─────────────────────────────────────────────────────────────
export default function ProductListingScreen({
  PRODUCTS = [],
  page = "buy",
  mode = "browse",
}) {
  const config = PAGE_CONFIG[page] ?? PAGE_CONFIG.buy;
  const isManage = mode === "manage";
  const isLostFound = page === "lost-found";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [filterModal, setFilterModal] = useState(false);

  const [tempCategory, setTempCategory] = useState("All");
  const [tempPriceRange, setTempPriceRange] = useState(PRICE_RANGES[0]);
  const [tempSort, setTempSort] = useState(SORT_OPTIONS[0]);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 22,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (filterModal) {
      setTempCategory(selectedCategory);
      setTempPriceRange(selectedPriceRange);
      setTempSort(selectedSort);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [filterModal]);

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedPriceRange(tempPriceRange);
    setSelectedSort(tempSort);
    setFilterModal(false);
  };

  const resetFilters = () => {
    setTempCategory("All");
    setTempPriceRange(PRICE_RANGES[0]);
    setTempSort(SORT_OPTIONS[0]);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    // Skip price filter for lost-found
    const matchPrice = isLostFound
      ? true
      : (p.price ?? 0) >= selectedPriceRange.min &&
        (p.price ?? 0) <= selectedPriceRange.max;
    return matchSearch && matchCategory && matchPrice;
  }).sort((a, b) => {
    if (selectedSort.key === "price_asc")
      return (a.price ?? 0) - (b.price ?? 0);
    if (selectedSort.key === "price_desc")
      return (b.price ?? 0) - (a.price ?? 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const activeFilterCount = [
    selectedCategory !== "All",
    !isLostFound &&
      (selectedPriceRange.min !== 0 || selectedPriceRange.max !== Infinity),
    selectedSort.key !== "latest",
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      {/* ── Header ─────────────────────────────── */}
      <LinearGradient colors={["#c3b5b0", "#0088ff"]} style={styles.header}>
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{config.title}</Text>
              {isManage && (
                <View style={styles.manageBadge}>
                  <Text style={styles.manageBadgeText}>MY LISTINGS</Text>
                </View>
              )}
            </View>

            <View style={{ width: 36 }} />
          </View>

          {/* Search + Filter */}
          <View style={styles.searchRow}>
            <View style={styles.searchWrap}>
              <Ionicons
                name="search-outline"
                size={17}
                color="#8E8E9A"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${config.title.toLowerCase()}...`}
                placeholderTextColor="#BDB8B3"
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={17} color="#BDB8B3" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setFilterModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="options-outline" size={19} color="#fff" />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* ── Active filter chips ─────────────────── */}
      {activeFilterCount > 0 && (
        <View style={styles.chipRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            {selectedCategory !== "All" && (
              <Chip
                label={selectedCategory}
                onRemove={() => setSelectedCategory("All")}
              />
            )}
            {!isLostFound &&
              (selectedPriceRange.min !== 0 ||
                selectedPriceRange.max !== Infinity) && (
                <Chip
                  label={selectedPriceRange.label}
                  onRemove={() => setSelectedPriceRange(PRICE_RANGES[0])}
                />
              )}
            {selectedSort.key !== "latest" && (
              <Chip
                label={selectedSort.label}
                onRemove={() => setSelectedSort(SORT_OPTIONS[0])}
              />
            )}
          </ScrollView>
        </View>
      )}

      {/* ── Results count ───────────────────────── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          <Text style={styles.resultsCount}>{filteredProducts.length}</Text>{" "}
          items found
        </Text>
        {isManage && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/post")}
            style={styles.addNewBtn}
          >
            <Ionicons name="add" size={15} color="#0088ff" />
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Product Grid ────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <EmptyState isManage={isManage} page={page} />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard item={item} mode={mode} page={page} config={config} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Filter Modal ────────────────────────── */}
      <Modal visible={filterModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModal(false)}
        />
        <Animated.View
          style={[
            styles.filterSheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort */}
            <Text style={styles.filterSectionLabel}>Sort By</Text>
            {SORT_OPTIONS
              // Hide price sort for lost-found
              .filter((opt) => (isLostFound ? opt.key === "latest" : true))
              .map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.filterOption}
                  onPress={() => setTempSort(opt)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      tempSort.key === opt.key && styles.radioOuterActive,
                    ]}
                  >
                    {tempSort.key === opt.key && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.filterOptionText,
                      tempSort.key === opt.key && {
                        color: "#0088ff",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}

            {/* Category */}
            <Text style={[styles.filterSectionLabel, { marginTop: 20 }]}>
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    tempCategory === cat && styles.catChipActive,
                  ]}
                  onPress={() => setTempCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      tempCategory === cat && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Price — hidden for lost-found */}
            {!isLostFound && (
              <>
                <Text style={[styles.filterSectionLabel, { marginTop: 20 }]}>
                  Price Range
                </Text>
                {PRICE_RANGES.map((range) => (
                  <TouchableOpacity
                    key={range.label}
                    style={styles.filterOption}
                    onPress={() => setTempPriceRange(range)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        tempPriceRange.label === range.label &&
                          styles.radioOuterActive,
                      ]}
                    >
                      {tempPriceRange.label === range.label && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempPriceRange.label === range.label && {
                          color: "#0088ff",
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={applyFilters}
            style={styles.applyBtn}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={["#54d5eb", "#0088ff"]}
              style={styles.applyGradient}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────
function ProductCard({ item, mode, page, config }) {
  const isManage = mode === "manage";
  const isLostFound = page === "lost-found";
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();

  const handlePress = () => {
    if (isManage) {
      // My listings → edit page
      router.push({
        pathname: "/my-listings/edit",
        params: { item: JSON.stringify(item) },
      });
    } else {
      // Browse → detail page per service
      router.push({
        pathname: config.detailRoute(item.id),
        params: { item: JSON.stringify(item) },
      });
    }
  };

  // Badge color based on type
  const badgeColor =
    item.type === "SELL"
      ? "#0088ff"
      : item.type === "RENT"
        ? "#00aacc"
        : "#6B7280"; // LOST/FOUND

  return (
    <Animated.View
      style={[cardStyles.wrap, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
        style={cardStyles.card}
      >
        {/* Image */}
        <View style={cardStyles.imgWrap}>
          <Image
            source={{ uri: item.images[0] }}
            style={cardStyles.img}
            resizeMode="cover"
          />
          <View style={[cardStyles.typeBadge, { backgroundColor: badgeColor }]}>
            <Text style={cardStyles.typeBadgeText}>{item.type}</Text>
          </View>

          {/* Manage mode — edit overlay icon */}
          {isManage && (
            <View style={cardStyles.editOverlay}>
              <View style={cardStyles.editIconBox}>
                <Ionicons name="create-outline" size={14} color="#fff" />
              </View>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={cardStyles.info}>
          <Text style={cardStyles.category} numberOfLines={1}>
            {item.category}
          </Text>
          <Text style={cardStyles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Price — hide for lost-found */}
          {!isLostFound && item.price != null && (
            <Text style={cardStyles.price}>
              ₹{Number(item.price).toLocaleString("en-IN")}
            </Text>
          )}

          {/* Seller */}
          <View style={cardStyles.sellerRow}>
            <View style={cardStyles.sellerAvatar}>
              <Text style={cardStyles.sellerAvatarText}>
                {item.seller?.[0] ?? "?"}
              </Text>
            </View>
            <Text style={cardStyles.sellerName} numberOfLines={1}>
              {item.seller}
            </Text>
          </View>

          {/* CTA button — differs by mode */}
          {isManage ? (
            // Manage mode → Edit + Delete row
            <View style={cardStyles.manageRow}>
              <TouchableOpacity
                style={cardStyles.editBtn}
                onPress={handlePress}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={13} color="#0088ff" />
                <Text style={cardStyles.editBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={cardStyles.deleteBtn}
                onPress={() =>
                  router.push({
                    pathname: "/my-listings/edit",
                    params: { item: JSON.stringify(item), action: "delete" },
                  })
                }
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={13} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          ) : (
            // Browse mode → Contact button
            <TouchableOpacity
              style={cardStyles.contactBtn}
              activeOpacity={0.8}
              onPress={handlePress}
            >
              <LinearGradient
                colors={["#54d5eb", "#0088ff"]}
                style={cardStyles.contactGradient}
              >
                <Text style={cardStyles.contactText}>
                  {isLostFound ? "View Details" : "Contact"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────
function EmptyState({ isManage, page }) {
  const messages = {
    buy: {
      title: "No items for sale",
      sub: "Check back later or adjust your filters",
    },
    rent: {
      title: "No items for rent",
      sub: "Check back later or adjust your filters",
    },
    "lost-found": {
      title: "Nothing reported yet",
      sub: "Be the first to post a lost or found item",
    },
  };
  const msg = messages[page] ?? messages.buy;

  return (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={56} color="#D0D5DD" />
      <Text style={styles.emptyTitle}>
        {isManage ? "No listings yet" : msg.title}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isManage ? "Tap 'Add New' to post your first listing" : msg.sub}
      </Text>
      {isManage && (
        <TouchableOpacity
          style={styles.emptyPostBtn}
          onPress={() => router.push("/(tabs)/sell")}
        >
          <LinearGradient
            colors={["#54d5eb", "#0088ff"]}
            style={styles.emptyPostGradient}
          >
            <Ionicons
              name="add"
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.emptyPostText}>Post a Listing</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// CHIP
// ─────────────────────────────────────────────────────────────
function Chip({ label, onRemove }) {
  return (
    <View style={chipStyles.chip}>
      <Text style={chipStyles.text} numberOfLines={1}>
        {label}
      </Text>
      <TouchableOpacity onPress={onRemove} style={{ marginLeft: 4 }}>
        <Ionicons name="close" size={13} color="#0088ff" />
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleWrap: { alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#fff" },
  manageBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  manageBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A2E",
    outlineStyle: "none",
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4D4D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  filterBadgeText: { fontSize: 10, fontWeight: "800", color: "#fff" },

  chipRow: {
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECE8",
  },
  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsText: { fontSize: 13, color: "#8E8E9A", fontWeight: "500" },
  resultsCount: { color: "#0088ff", fontWeight: "800" },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addNewText: { fontSize: 12, fontWeight: "700", color: "#0088ff" },

  row: { paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  listContent: { paddingTop: 12, paddingBottom: 100 },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A2E" },
  emptySubtitle: { fontSize: 13, color: "#8E8E9A", textAlign: "center" },
  emptyPostBtn: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  emptyPostGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  emptyPostText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  filterSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    maxHeight: "78%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 17, fontWeight: "900", color: "#1A1A2E" },
  resetText: { fontSize: 13, fontWeight: "700", color: "#FF4D4D" },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E9A",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F8FA",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#1A1A2E",
    marginLeft: 12,
    fontWeight: "500",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D0D5DD",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: { borderColor: "#0088ff" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0088ff",
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F7F8FA",
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
  },
  catChipActive: { backgroundColor: "#0088ff", borderColor: "#0088ff" },
  catChipText: { fontSize: 13, fontWeight: "600", color: "#8E8E9A" },
  catChipTextActive: { color: "#fff" },
  applyBtn: { borderRadius: 14, overflow: "hidden", marginTop: 20 },
  applyGradient: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 14,
  },
  applyText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});

const cardStyles = StyleSheet.create({
  wrap: { width: CARD_WIDTH },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0ECE8",
    shadowColor: "#0088ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  imgWrap: { width: "100%", height: CARD_WIDTH * 0.85, position: "relative" },
  img: { width: "100%", height: "100%", backgroundColor: "#F0F4F8" },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },

  // Manage-mode edit overlay (top-right pencil icon)
  editOverlay: { position: "absolute", top: 8, right: 8 },
  editIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  info: { padding: 10 },
  category: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8E8E9A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 18,
    marginBottom: 6,
  },
  price: { fontSize: 16, fontWeight: "900", color: "#0088ff", marginBottom: 8 },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerAvatarText: { fontSize: 10, fontWeight: "800", color: "#0088ff" },
  sellerName: { fontSize: 11, color: "#8E8E9A", fontWeight: "500", flex: 1 },

  // Browse CTA
  contactBtn: { borderRadius: 8, overflow: "hidden" },
  contactGradient: {
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
  },
  contactText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  // Manage CTAs
  manageRow: { flexDirection: "row", gap: 6 },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  editBtnText: { fontSize: 12, fontWeight: "700", color: "#0088ff" },
  deleteBtn: {
    width: 34,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFE0E0",
    alignItems: "center",
    justifyContent: "center",
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  text: { fontSize: 12, fontWeight: "600", color: "#0088ff", maxWidth: 120 },
});
