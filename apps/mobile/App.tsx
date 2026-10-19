import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { calcBmi, creatinineToUmolL, type CreatinineUnit } from "@clinic/domain";

const SCALE_MIN = 15;
const SCALE_MAX = 40;

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Az çəki", color: "#2B6CB0" };
  if (bmi < 25) return { label: "Normal", color: "#0F7B6C" };
  if (bmi < 30) return { label: "Artıq çəki", color: "#C2620A" };
  return { label: "Piylənmə", color: "#B42318" };
}

type StepperProps = {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
};

function Stepper({ label, unit, value, onChange }: StepperProps) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable style={styles.roundBtn} onPress={() => onChange(value - 1)}>
          <Text style={styles.roundBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>
          {value}
          <Text style={styles.stepperUnit}> {unit}</Text>
        </Text>
        <Pressable style={styles.roundBtn} onPress={() => onChange(value + 1)}>
          <Text style={styles.roundBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(78);
  const [creatinine, setCreatinine] = useState("1,8");
  const [unit, setUnit] = useState<CreatinineUnit>("mg/dL");

  const bmi = calcBmi(weight, height);
  const cat = bmiCategory(bmi);
  const markerPct =
    ((Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

  let converted: string;
  try {
    const v = parseFloat(creatinine.replace(",", "."));
    converted = `${creatinineToUmolL(v, unit).toFixed(0)} µmol/L`;
  } catch {
    converted = "Düzgün dəyər daxil edin";
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Text style={styles.heroSmall}>Klinik qidalanma</Text>
        <Text style={styles.heroTitle}>Demo ekran</Text>
        <Text style={styles.heroSub}>Bütün hesablar @clinic/domain paketindən gəlir</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Stepper label="Boy" unit="sm" value={height} onChange={(v) => setHeight(Math.max(100, v))} />
          <Stepper label="Çəki" unit="kq" value={weight} onChange={(v) => setWeight(Math.max(30, v))} />
        </View>

        <View style={styles.bmiBox}>
          <Text style={styles.bmiValue}>{bmi.toFixed(1).replace(".", ",")}</Text>
          <Text style={[styles.bmiLabel, { color: cat.color }]}>{cat.label}</Text>
        </View>

        <View style={styles.scale}>
          <View style={[styles.segment, { flex: 3.5, backgroundColor: "#2B6CB0" }]} />
          <View style={[styles.segment, { flex: 6.5, backgroundColor: "#0F7B6C" }]} />
          <View style={[styles.segment, { flex: 5, backgroundColor: "#C2620A" }]} />
          <View style={[styles.segment, { flex: 10, backgroundColor: "#B42318" }]} />
          <View style={[styles.marker, { left: `${markerPct}%` }]} />
        </View>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleText}>15</Text>
          <Text style={styles.scaleText}>18,5</Text>
          <Text style={styles.scaleText}>25</Text>
          <Text style={styles.scaleText}>30</Text>
          <Text style={styles.scaleText}>40</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kreatinin çevirici</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={creatinine}
            onChangeText={setCreatinine}
            keyboardType="decimal-pad"
          />
          <View style={styles.toggle}>
            {(["mg/dL", "umol/L"] as const).map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnit(u)}
                style={[styles.toggleBtn, unit === u && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, unit === u && styles.toggleTextActive]}>
                  {u === "umol/L" ? "µmol/L" : u}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.converted}>= {converted}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6F3" },
  content: { padding: 20, paddingTop: 64, gap: 16 },
  hero: { backgroundColor: "#0F5C55", borderRadius: 24, padding: 22, gap: 4 },
  heroSmall: { color: "#BFDCD6", fontSize: 13, fontWeight: "600" },
  heroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  heroSub: { color: "#D7EAE6", fontSize: 13 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, gap: 14, borderWidth: 1, borderColor: "#DCE3DF" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#14201C" },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  stepper: { flex: 1, gap: 6 },
  stepperLabel: { fontSize: 13, fontWeight: "700", color: "#4A5A54" },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepperValue: { fontSize: 22, fontWeight: "800", color: "#14201C" },
  stepperUnit: { fontSize: 13, fontWeight: "600", color: "#4A5A54" },
  roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E4F0EC", alignItems: "center", justifyContent: "center" },
  roundBtnText: { fontSize: 22, fontWeight: "700", color: "#0F5C55" },
  bmiBox: { alignItems: "center", paddingVertical: 6 },
  bmiValue: { fontSize: 56, fontWeight: "800", color: "#14201C", letterSpacing: -1 },
  bmiLabel: { fontSize: 16, fontWeight: "800" },
  scale: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "visible" },
  segment: { height: 12 },
  marker: { position: "absolute", top: -6, width: 4, height: 24, marginLeft: -2, borderRadius: 2, backgroundColor: "#14201C" },
  scaleLabels: { flexDirection: "row", justifyContent: "space-between" },
  scaleText: { fontSize: 11, color: "#4A5A54", fontWeight: "600" },
  input: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#C5D0CB", paddingHorizontal: 14, fontSize: 18, color: "#14201C" },
  toggle: { flexDirection: "row", backgroundColor: "#E3E9E6", borderRadius: 12, padding: 4, gap: 4 },
  toggleBtn: { paddingHorizontal: 12, height: 40, borderRadius: 9, justifyContent: "center" },
  toggleBtnActive: { backgroundColor: "#0F5C55" },
  toggleText: { fontSize: 13, fontWeight: "700", color: "#14201C" },
  toggleTextActive: { color: "#FFFFFF" },
  converted: { fontSize: 20, fontWeight: "800", color: "#0F5C55" },
});