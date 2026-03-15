import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { postSellProduct } from "../../services/buy-sell-services/post-product";
import { postRentProduct } from "../../services/rent-service/post-product";
import { postLostFoundProduct } from "../../services/lost-found-service/post-product";

// ─────────────────────────────────────────────────────────────
// ⚙️  Update these to your actual microservice IPs / ports
// ─────────────────────────────────────────────────────────────
// const API = {
//   SELL: "http://192.168.x.x:5002/api/sell",
//   RENT: "http://192.168.x.x:5003/api/rent",
//   LOST: "http://192.168.x.x:5004/api/lost-found",
//   FOUND: "http://192.168.x.x:5004/api/lost-found",
// };

const CATEGORIES = [
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

const LISTING_TYPES = ["SELL", "RENT", "LOST", "FOUND"];

const TYPE_META = {
  SELL: {
    icon: "bag-handle-outline",
    activeIcon: "bag-handle",
    label: "Post for Sale",
    color: "#0088ff",
  },
  RENT: {
    icon: "repeat-outline",
    activeIcon: "repeat",
    label: "Post for Rent",
    color: "#00aacc",
  },
  LOST: {
    icon: "help-circle-outline",
    activeIcon: "help-circle",
    label: "Report Lost Item",
    color: "#FF8C00",
  },
  FOUND: {
    icon: "checkmark-circle-outline",
    activeIcon: "checkmark-circle",
    label: "Report Found Item",
    color: "#00C48C",
  },
};

const API_MAP = {
  SELL: postSellProduct,
  RENT: postRentProduct,
  LOST: postLostFoundProduct,
  FOUND: postLostFoundProduct,
};

export default function PostScreen() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [listingType, setListingType] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");

  // UI state
  const [categoryModal, setCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLostFound = listingType === "LOST" || listingType === "FOUND";
  const showPrice = listingType === "SELL" || listingType === "RENT";
  const activeMeta = listingType ? TYPE_META[listingType] : null;

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  // ── Load user + token ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [[, userData], [, token]] = await AsyncStorage.multiGet([
          "user",
          "accessToken",
        ]);
        if (userData) setUser(JSON.parse(userData));
        if (token) setAccessToken(token);
      } catch {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load user data.",
        });
      }
    };
    load();

    Animated.stagger(80, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 22,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fadeUp = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  // ── Image picker ─────────────────────────────────────────────
  const pickImage = async () => {
    if (images.length >= 3) {
      Toast.show({
        type: "error",
        text1: "Limit Reached",
        text2: "Maximum 3 images allowed.",
      });
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Camera roll access is required.",
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ no deprecation warning
      allowsEditing: true, // ✅ any aspect ratio
      quality: 0.5, // ✅ balanced file size
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // ── Build multipart/form-data ────────────────────────────────
  const buildFormData = () => {
    const fd = new FormData();

    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("category", category);
    fd.append("type", listingType);
    fd.append("location", location.trim());
    fd.append("seller", user?.name ?? "");
    fd.append("college", user?.college ?? "");
    fd.append("sellerId", user?.id ?? "");

    if (showPrice) fd.append("price", price.trim());

    // Attach each image as a file blob
    images.forEach((uri) => {
      const filename = uri.split("/").pop() ?? "image.jpg";
      const ext = filename.split(".").pop()?.toLowerCase();
      fd.append("images", {
        uri,
        name: filename,
        type: ext === "png" ? "image/png" : "image/jpeg",
      });
    });

    return fd;
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const checks = [
      [
        !listingType,
        "Missing Field",
        "Please select a listing type (Sell / Rent / Lost / Found).",
      ],
      [!title.trim(), "Missing Field", "Please enter a title."],
      [!description.trim(), "Missing Field", "Please enter a description."],
      [showPrice && !price.trim(), "Missing Field", "Please enter a price."],
      [
        showPrice && isNaN(Number(price)),
        "Invalid Price",
        "Price must be a valid number.",
      ],
      [!category, "Missing Field", "Please select a category."],
      [!location.trim(), "Missing Field", "Please enter a location."],
      [images.length < 1, "Missing Images", "Please add at least 1 image."],
    ];

    for (const [fail, title, text2] of checks) {
      if (fail) {
        Toast.show({ type: "error", text1: title, text2 });
        return false;
      }
    }
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const apiCall = API_MAP[listingType];

      if (!apiCall) {
        throw new Error("Invalid listing type");
      }

      await apiCall(buildFormData());

      Toast.show({
        type: "success",
        text1: "Listing Posted! 🎉",
        text2: "Your listing is now live.",
        visibilityTime: 3000,
      });

      // Reset all fields
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setListingType("");
      setImages([]);
      setLocation("");

      router.replace("/(tabs)");
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? (e.response?.data?.message ?? e.message)
        : "Something went wrong.";
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: msg,
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ─────────────────────────── */}
        <LinearGradient colors={["#c3b5b0", "#0088ff"]} style={styles.header}>
          <Animated.View style={fadeUp(headerAnim)}>
            <Text style={styles.brandName}>CampusCart</Text>
            <Text style={styles.headerTitle}>Post a Listing</Text>
            <Text style={styles.headerSubtitle}>
              Sell, rent, or report lost & found items
            </Text>

            {/* 4-way type toggle */}
            <View style={styles.typeToggleRow}>
              {LISTING_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeToggleBtn,
                    listingType === t && [
                      styles.typeToggleBtnActive,
                      {
                        borderBottomWidth: 2,
                        borderBottomColor: TYPE_META[t].color,
                      },
                    ],
                  ]}
                  onPress={() => setListingType(t)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      listingType === t
                        ? TYPE_META[t].activeIcon
                        : TYPE_META[t].icon
                    }
                    size={14}
                    color={
                      listingType === t
                        ? TYPE_META[t].color
                        : "rgba(255,255,255,0.7)"
                    }
                    style={{ marginBottom: 3 }}
                  />
                  <Text
                    style={[
                      styles.typeToggleText,
                      listingType === t && {
                        color: TYPE_META[t].color,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* ── Form Card ──────────────────────── */}
        <Animated.View style={[styles.formCard, fadeUp(formAnim)]}>
          {/* ─ Seller Info ─ */}
          <SectionHeader title="Seller Info" />

          <FieldLabel text="Your Name" />
          <LockedInput
            icon="person-outline"
            value={user?.name ?? "Loading..."}
          />

          <FieldLabel text="College" />
          <LockedInput
            icon="school-outline"
            value={user?.college ?? "Loading..."}
          />

          {/* ─ Product Details ─ */}
          <SectionHeader title="Product Details" style={{ marginTop: 24 }} />

          <FieldLabel text="Title" />
          <View style={styles.inputWrap}>
            <Ionicons
              name="pricetag-outline"
              size={17}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g. MTech First Year Textbooks"
              placeholderTextColor="#BDB8B3"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <Text style={styles.inlineCount}>{title.length}/80</Text>
          </View>

          <FieldLabel text="Description" />
          <View style={[styles.inputWrap, styles.textAreaWrap]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={
                isLostFound
                  ? "Describe the item — color, brand, when & where lost/found..."
                  : "Describe condition, age, reason for selling..."
              }
              placeholderTextColor="#BDB8B3"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.charCount}>{description.length}/500</Text>

          {/* Price — SELL / RENT only */}
          {showPrice && (
            <>
              <FieldLabel
                text={
                  listingType === "RENT"
                    ? "Price (₹ per day / week)"
                    : "Price (₹)"
                }
              />
              <View style={styles.inputWrap}>
                <Text style={styles.rupeeSign}>₹</Text>
                <TextInput
                  style={[styles.input, { marginLeft: 4 }]}
                  placeholder={
                    listingType === "RENT" ? "e.g. 50 per day" : "asking price"
                  }
                  placeholderTextColor="#BDB8B3"
                  value={price}
                  onChangeText={(v) => setPrice(v.replace(/[^0-9.]/g, ""))}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {/* Category */}
          <FieldLabel text="Category" />
          <TouchableOpacity
            style={styles.inputWrap}
            onPress={() => setCategoryModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="grid-outline"
              size={17}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <Text
              style={[
                styles.input,
                {
                  paddingVertical: 13,
                  color: category ? "#1A1A2E" : "#BDB8B3",
                },
              ]}
            >
              {category || "Select a category"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#8E8E9A" />
          </TouchableOpacity>

          {/* ─ Location ─ */}
          <SectionHeader title="Location" style={{ marginTop: 24 }} />

          <FieldLabel text="Where is this item located?" />
          <View style={styles.inputWrap}>
            <Ionicons
              name="location-outline"
              size={17}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g. Hostel 5, Block B, IIT Bombay"
              placeholderTextColor="#BDB8B3"
              value={location}
              onChangeText={setLocation}
              maxLength={120}
            />
          </View>

          {/* ─ Photos ─ */}
          <SectionHeader
            title="Photos"
            hint="  1–3 images required"
            style={{ marginTop: 24 }}
          />

          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageThumb}>
                <Image source={{ uri }} style={styles.thumbImg} />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeImgBtn}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 3 && (
              <TouchableOpacity
                style={styles.addImgBtn}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#EFF6FF", "#DBEAFE"]}
                  style={styles.addImgGradient}
                >
                  <Ionicons name="camera-outline" size={26} color="#0088ff" />
                  <Text style={styles.addImgText}>Add Photo</Text>
                  <Text style={styles.addImgCount}>{images.length}/3</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* ─ Submit ─ */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={
                loading
                  ? ["#A0CFEE", "#C8E6FA"]
                  : activeMeta
                    ? [`${activeMeta.color}CC`, activeMeta.color]
                    : ["#54d5eb", "#0088ff"]
              }
              style={styles.submitGradient}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.submitText}>Posting...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name={activeMeta?.activeIcon ?? "send"}
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.submitText}>
                    {activeMeta?.label ?? "Select a type above"}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* ── Category Modal ──────────────────── */}
      <Modal visible={categoryModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModal(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Category</Text>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  category === item && styles.modalItemActive,
                ]}
                onPress={() => {
                  setCategory(item);
                  setCategoryModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    category === item && styles.modalItemTextActive,
                  ]}
                >
                  {item}
                </Text>
                {category === item && (
                  <Ionicons name="checkmark-circle" size={20} color="#0088ff" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ── Reusable micro-components ──────────────────────────────────
function SectionHeader({ title, hint, style }) {
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", marginBottom: 14 },
        style,
      ]}
    >
      <View
        style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          backgroundColor: "#0088ff",
          marginRight: 10,
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: "800", color: "#1A1A2E" }}>
        {title}
      </Text>
      {hint && (
        <Text style={{ fontSize: 11, color: "#8E8E9A", fontWeight: "500" }}>
          {hint}
        </Text>
      )}
    </View>
  );
}

function FieldLabel({ text }) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: "600",
        color: "#1A1A2E",
        marginBottom: 7,
        marginTop: 14,
      }}
    >
      {text}
    </Text>
  );
}

function LockedInput({ icon, value }) {
  return (
    <View style={[styles.inputWrap, styles.disabledInput]}>
      <Ionicons
        name={icon}
        size={17}
        color="#B0B8C1"
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, { color: "#B0B8C1" }]}
        value={value}
        editable={false}
      />
      <Ionicons name="lock-closed" size={14} color="#B0B8C1" />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0088ff" },
  scroll: { paddingBottom: 40 },

  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#fff" },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    marginBottom: 20,
  },

  // 4-way toggle
  typeToggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 5,
  },
  typeToggleBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeToggleBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  typeToggleText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
  },

  // Form
  formCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -14,
    padding: 24,
    paddingBottom: 48,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
  },
  disabledInput: { backgroundColor: "#F4F4F4", borderColor: "#EBEBEB" },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1A1A2E",
    outlineStyle: "none",
  },
  inlineCount: { fontSize: 10, color: "#B0B8C1" },
  textAreaWrap: { alignItems: "flex-start", paddingVertical: 10 },
  textArea: { minHeight: 100, paddingVertical: 4, lineHeight: 20 },
  charCount: {
    fontSize: 11,
    color: "#B0B8C1",
    textAlign: "right",
    marginTop: 4,
  },
  rupeeSign: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginRight: 2,
  },

  // Images
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  thumbImg: { width: "100%", height: "100%" },
  coverBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,136,255,0.75)",
    paddingVertical: 3,
    alignItems: "center",
  },
  coverBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  removeImgBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  addImgBtn: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    borderStyle: "dashed",
  },
  addImgGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  addImgText: { fontSize: 11, fontWeight: "700", color: "#0088ff" },
  addImgCount: { fontSize: 10, color: "#8E8E9A" },

  // Submit
  submitBtn: { borderRadius: 16, overflow: "hidden", marginTop: 28 },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitText: { fontSize: 16, fontWeight: "800", color: "#fff" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    maxHeight: "60%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECE8",
  },
  modalItemActive: {
    backgroundColor: "#EFF6FF",
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  modalItemText: { fontSize: 14, fontWeight: "500", color: "#1A1A2E" },
  modalItemTextActive: { fontWeight: "700", color: "#0088ff" },
});
