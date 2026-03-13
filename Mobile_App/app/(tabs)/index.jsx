import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const H_PAD = 20;
const CARD_GAP = 12;
const SQUARE_SIZE = (width - H_PAD * 2 - CARD_GAP) / 2;
const WIDE_HEIGHT = SQUARE_SIZE * 0.58;

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(headerAnim, { toValue: 1, tension: 22, friction: 7, useNativeDriver: true }),
      Animated.spring(searchAnim, { toValue: 1, tension: 22, friction: 7, useNativeDriver: true }),
      Animated.spring(card1Anim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(card2Anim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(card3Anim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const animStyle = (anim) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0088ff" />

      {/* Blue gradient header */}
      <LinearGradient colors={["#c3b5b0", "#0088ff"]} style={styles.topGradient}>
        <Animated.View style={[styles.headerRow, animStyle(headerAnim)]}>
          <View>
            <Text style={styles.brandName}>🛒 CampusCart</Text>
            <Text style={styles.greeting}>What are you looking for?</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.searchWrap, animStyle(searchAnim)]}>
          <Ionicons name="search-outline" size={18} color="#8E8E9A" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, categories..."
            placeholderTextColor="#BDB8B3"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#BDB8B3" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>

      {/* White body */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>

        {/* Top row — Buy + Rent (square) */}
        <View style={styles.topRow}>

          {/* Buy */}
          <Animated.View style={animStyle(card1Anim)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/buy")}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={["#1a8fff", "#0066cc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.squareCard, { width: SQUARE_SIZE, height: SQUARE_SIZE }]}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                <View style={styles.arrowBadge}>
                  <Ionicons name="arrow-forward" size={13} color="rgba(255,255,255,0.8)" />
                </View>
                <View style={styles.cardInner}>
                  <View style={styles.iconBox}>
                    <Ionicons name="bag-handle" size={26} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Buy</Text>
                  <Text style={styles.cardSub}>Find items{"\n"}on campus</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Rent */}
          <Animated.View style={animStyle(card2Anim)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/rent")}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={["#2ddde4", "#00aacc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.squareCard, { width: SQUARE_SIZE, height: SQUARE_SIZE }]}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                <View style={styles.arrowBadge}>
                  <Ionicons name="arrow-forward" size={13} color="rgba(255,255,255,0.8)" />
                </View>
                <View style={styles.cardInner}>
                  <View style={styles.iconBox}>
                    <Ionicons name="repeat" size={26} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>Rent</Text>
                  <Text style={styles.cardSub}>Borrow items{"\n"}temporarily</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* Lost & Found — wide */}
        <Animated.View style={[{ marginTop: CARD_GAP }, animStyle(card3Anim)]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/lost-found")}
            style={styles.cardTouch}
          >
            <LinearGradient
              colors={["#1A1A2E", "#0f3460"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.wideCard, { height: WIDE_HEIGHT }]}
            >
              <View style={styles.wideDecCircle} />
              <View style={styles.wideLeft}>
                <View style={[styles.iconBox, styles.iconBoxDark]}>
                  <Ionicons name="search-circle" size={26} color="#54d5eb" />
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.cardTitle}>Lost & Found</Text>
                  <Text style={[styles.cardSub, { color: "rgba(255,255,255,0.55)" }]}>
                    Lost or found something on campus?
                  </Text>
                </View>
              </View>
              <View style={styles.wideArrow}>
                <Ionicons name="arrow-forward" size={16} color="#54d5eb" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },

  topGradient: {
    paddingTop: Platform.OS === "ios" ? 56 : 42,
    paddingHorizontal: H_PAD,
    paddingBottom: 26,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  brandName: { fontSize: 20, fontWeight: "900", color: "#fff", marginBottom: 3 },
  greeting: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: "500" },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  notifDot: {
    position: "absolute", top: 9, right: 9,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#FF4D4D",
    borderWidth: 1.5, borderColor: "#0088ff",
  },
  searchWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14,
    paddingHorizontal: 14, height: 48,
    shadowColor: "#0055cc", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#1A1A2E", outlineStyle: "none" },

  body: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -14,
    paddingHorizontal: H_PAD,
    paddingTop: 24,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: "800", color: "#8E8E9A",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTouch: { borderRadius: 20, overflow: "hidden" },

  squareCard: {
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardInner: { zIndex: 2 },
  iconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  iconBoxDark: {
    backgroundColor: "rgba(0,136,255,0.2)",
  },
  cardTitle: {
    fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 3,
  },
  cardSub: {
    fontSize: 11, color: "rgba(255,255,255,0.72)",
    lineHeight: 16, fontWeight: "500",
  },
  arrowBadge: {
    position: "absolute", top: 14, right: 14, zIndex: 2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  decCircle1: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.12)", top: -28, right: -28,
  },
  decCircle2: {
    position: "absolute", width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)", bottom: 10, left: -20,
  },

  wideCard: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  wideDecCircle: {
    position: "absolute", width: 140, height: 140, borderRadius: 70,
    backgroundColor: "rgba(0,136,255,0.1)", top: -50, right: 40,
  },
  wideLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  wideArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(84,213,235,0.15)",
    justifyContent: "center", alignItems: "center",
  },
});