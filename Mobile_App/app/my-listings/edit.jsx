import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Platform,
  Image,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import { editSellProduct } from "../../services/buy-sell-services/edit-product";
import { deleteSellProduct } from "../../services/buy-sell-services/edit-product";
import { editRentProduct } from "../../services/rent-service/edit-product";
import { deleteRentProduct } from "../../services/rent-service/edit-product";
import { editLostFoundProduct } from "../../services/lost-found-service/edit-product";
import { deleteLostFoundProduct } from "../../services/lost-found-service/edit-product";

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

const LOST_FOUND_TYPES = ["LOST", "FOUND"];

const EDIT_API_MAP = {
  SELL: editSellProduct,
  RENT: editRentProduct,
  LOST: editLostFoundProduct,
  FOUND: editLostFoundProduct,
};

const DELETE_API_MAP = {
  SELL: deleteSellProduct,
  RENT: deleteRentProduct,
  LOST: deleteLostFoundProduct,
  FOUND: deleteLostFoundProduct,
};

export default function EditListingScreen() {
  const { item } = useLocalSearchParams();
  const product = JSON.parse(item);

  const isLostFound =
    product.type === "LOST" ||
    product.type === "FOUND" ||
    product.type === "LOST/FOUND";
  const isRent = product.type === "RENT";

  // Form state — pre-filled from product
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(
    product.price ? String(product.price) : "",
  );
  const [category, setCategory] = useState(product.category || "");
  const [lostFoundType, setLostFoundType] = useState(
    product.type === "LOST" ? "LOST" : product.type === "FOUND" ? "FOUND" : "",
  );
  const [images, setImages] = useState(product.images || []);

  // UI state
  const [categoryModal, setCategoryModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const deleteShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  // Track changes
  useEffect(() => {
    const changed =
      title !== product.title ||
      description !== product.description ||
      price !== String(product.price || "") ||
      category !== product.category ||
      images.join() !== product.images.join() ||
      (isLostFound && lostFoundType !== product.type);
    setHasChanges(changed);
  }, [title, description, price, category, images, lostFoundType]);

  const animStyle = (anim) => ({
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

  const pickImage = async () => {
    if (images.length >= 3) {
      Toast.show("Maximum 3 images allowed", {
        duration: Toast.durations.LONG,
      });

      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show("Camera roll access is required", {
        duration: Toast.durations.LONG,
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    if (images.length === 1) {
      Toast.show("At least 1 image is required", {
        duration: Toast.durations.LONG,
      });

      return;
    }
    Alert.alert("Remove Image", "Remove this image from the listing?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setImages((prev) => prev.filter((_, i) => i !== index)),
      },
    ]);
  };

  const buildFormData = () => {
    const fd = new FormData();

    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("category", category);
    fd.append("type", product.type);
    fd.append("location", product.location || "Unknown");
    fd.append("seller", product?.name ?? "");
    fd.append("college", product?.college ?? "");
    fd.append("sellerId", product?.sellerId ?? "");

    if (!isLostFound) fd.append("price", price.trim());

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

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a title.",
      });
      return;
    }
    if (!description.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a description.",
      });
      return;
    }
    if (!isLostFound && !price.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter a price.",
      });
      return;
    }
    if (!category) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please select a category.",
      });
      return;
    }
    if (isLostFound && !lostFoundType) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please select Lost or Found.",
      });
      return;
    }
    if (images.length < 1) {
      Toast.show({
        type: "error",
        text1: "Missing Images",
        text2: "At least 1 image is required.",
      });
      return;
    }

    setSaving(true);
    try {
      const formData = buildFormData();
      const apiCall = EDIT_API_MAP[product.type];
      await apiCall({ formData }); // TODO: Implement API calls in api.js
      Toast.show({
        type: "success",
        text1: "Listing Updated",
        text2: "Your changes have been saved.",
      });
      setHasChanges(false);
      router.push("/my-listings");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update listing. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // TODO: Replace with your API call
      // await axios.delete(`http://SERVICE/products/${product.id}`);
      const apiCall = DELETE_API_MAP[product.type];
      await apiCall({ id: product.id });

      setDeleteModal(false);
      Toast.show({
        type: "success",
        text1: "Listing Deleted",
        text2: `"${product.title}" has been removed from your listings.`,
      });
      router.push("/my-listings");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete listing. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Header accent color based on type
  const typeColor = isLostFound ? "#1A1A2E" : isRent ? "#00aacc" : "#0088ff";
  const typeLabel = isLostFound ? "Lost & Found" : isRent ? "Rent" : "Sell";
  const typeIcon = isLostFound
    ? "search-circle"
    : isRent
      ? "repeat"
      : "bag-handle";

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
          <Animated.View style={animStyle(headerAnim)}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.brandName}>🛒 CampusCart</Text>
              {/* Delete button in header */}
              <TouchableOpacity
                style={styles.deleteHeaderBtn}
                onPress={() => setDeleteModal(true)}
              >
                <Ionicons name="trash-outline" size={19} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerTitle}>Edit Listing</Text>

            {/* Type pill */}
            <View style={styles.typePill}>
              <Ionicons name={typeIcon} size={14} color="#fff" />
              <Text style={styles.typePillText}>{typeLabel}</Text>
              <View style={styles.typePillDivider} />
              <Text style={styles.typePillId}>ID: {product.id}</Text>
            </View>

            {/* Changes indicator */}
            {hasChanges && (
              <View style={styles.changesBanner}>
                <Ionicons name="pencil" size={13} color="#FFA500" />
                <Text style={styles.changesBannerText}>
                  You have unsaved changes
                </Text>
              </View>
            )}
          </Animated.View>
        </LinearGradient>

        {/* ── Form Card ──────────────────────── */}
        <Animated.View style={[styles.formCard, animStyle(formAnim)]}>
          {/* ── Listing Type (Lost/Found only) ── */}
          {isLostFound && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Report Type</Text>
              </View>
              <View style={styles.typeToggleRow}>
                {LOST_FOUND_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeToggleBtn,
                      lostFoundType === t && styles.typeToggleBtnActive,
                    ]}
                    onPress={() => setLostFoundType(t)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        t === "LOST"
                          ? "help-circle-outline"
                          : "checkmark-circle-outline"
                      }
                      size={15}
                      color={lostFoundType === t ? "#0088ff" : "#8E8E9A"}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.typeToggleText,
                        lostFoundType === t && styles.typeToggleTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* ── Product Details ─────────────── */}
          <View
            style={[styles.sectionHeader, isLostFound && { marginTop: 20 }]}
          >
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Product Details</Text>
          </View>

          <Text style={styles.label}>Title</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="pricetag-outline"
              size={17}
              color="#8E8E9A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Product title"
              placeholderTextColor="#BDB8B3"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
          </View>

          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputWrap, styles.textAreaWrap]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your item..."
              placeholderTextColor="#BDB8B3"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.charCount}>{description.length}/500</Text>

          {/* Price — hidden for lost & found */}
          {!isLostFound && (
            <>
              <Text style={styles.label}>
                Price (₹)
                {isRent && (
                  <Text style={styles.labelHint}> — per day/week</Text>
                )}
              </Text>
              <View style={styles.inputWrap}>
                <Text style={styles.rupeeSign}>₹</Text>
                <TextInput
                  style={[styles.input, { marginLeft: 4 }]}
                  placeholder="Enter price"
                  placeholderTextColor="#BDB8B3"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {/* Category */}
          <Text style={styles.label}>Category</Text>
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
              {category || "Select category"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#8E8E9A" />
          </TouchableOpacity>

          {/* ── Images ─────────────────────── */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionHint}>
              {" "}
              Tap image to remove · 1–3 required
            </Text>
          </View>

          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageThumb}
                onPress={() => removeImage(index)}
                activeOpacity={0.8}
              >
                <Image source={{ uri }} style={styles.thumbImg} />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
                <View style={styles.removeOverlay}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
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

          {/* ── Metadata (read-only) ────────── */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <View style={[styles.sectionDot, { backgroundColor: "#8E8E9A" }]} />
            <Text style={[styles.sectionTitle, { color: "#8E8E9A" }]}>
              Listing Info
            </Text>
          </View>

          <View style={styles.metaGrid}>
            <MetaItem label="Seller" value={product.seller} />
            <MetaItem label="College" value={product.college} />
            <MetaItem label="Posted" value={product.createdAt} />
            <MetaItem label="Item ID" value={product.id} mono />
          </View>

          {/* ── Save Button ─────────────────── */}
          <TouchableOpacity
            style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving || !hasChanges}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={
                hasChanges ? ["#54d5eb", "#0088ff"] : ["#D0D5DD", "#D0D5DD"]
              }
              style={styles.saveBtnGradient}
            >
              <Ionicons
                name={saving ? "reload-outline" : "checkmark-circle-outline"}
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveBtnText}>
                {saving
                  ? "Saving..."
                  : hasChanges
                    ? "Save Changes"
                    : "No Changes"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ── Delete Button ────────────────── */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setDeleteModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="trash-outline"
              size={17}
              color="#FF4D4D"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.deleteBtnText}>Delete Listing</Text>
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
            keyExtractor={(i) => i}
            renderItem={({ item: cat }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  category === cat && styles.modalItemActive,
                ]}
                onPress={() => {
                  setCategory(cat);
                  setCategoryModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    category === cat && styles.modalItemTextActive,
                  ]}
                >
                  {cat}
                </Text>
                {category === cat && (
                  <Ionicons name="checkmark-circle" size={20} color="#0088ff" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* ── Delete Confirmation Modal ────────── */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            {/* Icon */}
            <View style={styles.deleteIconCircle}>
              <Ionicons name="trash" size={32} color="#FF4D4D" />
            </View>

            <Text style={styles.deleteModalTitle}>Delete Listing?</Text>
            <Text style={styles.deleteModalSubtitle}>
              This will permanently remove "{product.title}" from your listings.
              This action cannot be undone.
            </Text>

            {/* Product preview */}
            <View style={styles.deletePreview}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.deletePreviewImg}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.deletePreviewTitle} numberOfLines={1}>
                  {product.title}
                </Text>
                <Text style={styles.deletePreviewMeta}>
                  {product.category} · {product.type}
                </Text>
                {product.price && (
                  <Text style={styles.deletePreviewPrice}>
                    ₹{product.price}
                  </Text>
                )}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.deleteModalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={handleDelete}
                disabled={deleting}
              >
                <LinearGradient
                  colors={["#ff6b6b", "#ee4444"]}
                  style={styles.confirmDeleteGradient}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.confirmDeleteText}>
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ── Sub components ─────────────────────────────────────────────
function MetaItem({ label, value, mono }) {
  return (
    <View style={metaStyles.item}>
      <Text style={metaStyles.label}>{label}</Text>
      <Text
        style={[metaStyles.value, mono && metaStyles.mono]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0088ff" },
  scroll: { paddingBottom: 40 },

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,80,80,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: { fontSize: 18, fontWeight: "900", color: "#fff" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
  },

  typePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 7,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  typePillText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  typePillDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  typePillId: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },

  changesBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,165,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.4)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  changesBannerText: { fontSize: 12, fontWeight: "600", color: "#FFA500" },

  // Form card
  formCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -14,
    padding: 24,
    paddingBottom: 48,
  },

  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#0088ff",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: 0.3,
  },
  sectionHint: { fontSize: 10, color: "#8E8E9A", fontWeight: "500" },

  // Type toggle (lost/found)
  typeToggleRow: {
    flexDirection: "row",
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    padding: 5,
    marginBottom: 4,
  },
  typeToggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeToggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#0088ff",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeToggleText: { fontSize: 14, fontWeight: "700", color: "#8E8E9A" },
  typeToggleTextActive: { color: "#0088ff" },

  // Inputs
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 7,
    marginTop: 14,
  },
  labelHint: { fontSize: 11, color: "#8E8E9A", fontWeight: "400" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1A1A2E",
    outlineStyle: "none",
  },
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
  imageThumb: { width: 100, height: 100, borderRadius: 14, overflow: "hidden" },
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
  removeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0)",
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

  // Meta grid
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Save
  saveBtn: { borderRadius: 16, overflow: "hidden", marginTop: 28 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  saveBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Delete
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#FFE0E0",
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
  },
  deleteBtnText: { fontSize: 14, fontWeight: "700", color: "#FF4D4D" },

  // Category modal
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

  // Delete confirm modal
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  deleteModalCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  deleteIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#FFE0E0",
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  deleteModalSubtitle: {
    fontSize: 13,
    color: "#8E8E9A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: "500",
  },
  deletePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    padding: 12,
    width: "100%",
    marginBottom: 22,
  },
  deletePreviewImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E8EBF0",
  },
  deletePreviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 3,
  },
  deletePreviewMeta: { fontSize: 11, color: "#8E8E9A", fontWeight: "500" },
  deletePreviewPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0088ff",
    marginTop: 3,
  },

  deleteModalBtns: { flexDirection: "row", gap: 12, width: "100%" },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#F0E8E2",
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: "#8E8E9A" },
  confirmDeleteBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  confirmDeleteGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmDeleteText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

const metaStyles = StyleSheet.create({
  item: {
    width: "47%",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 12,
  },
  label: {
    fontSize: 10,
    color: "#8E8E9A",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: { fontSize: 13, fontWeight: "700", color: "#1A1A2E" },
  mono: {
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#8E8E9A",
  },
});
