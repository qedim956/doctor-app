import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  LAB_TYPES,
  LAB_UNITS,
  createLabSchema,
  type LabType,
} from "@clinic/domain";
import { ApiError, type LabResult } from "@clinic/api-client";
import { api } from "../src/lib/api";

// MÜVƏQQƏTİ: auth gələnə qədər
const PATIENT_ID = process.env.EXPO_PUBLIC_DEV_PATIENT_ID!;

const LAB_LABELS: Record<LabType, string> = {
  creatinine: "Kreatinin",
  potassium: "Kalium",
  phosphorus: "Fosfor",
  albumin: "Albumin",
};

type FormValues = {
  type: LabType;
  value: string;
  unit: string;
  takenAt: string;
};

function today() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function LabsScreen() {
  const [results, setResults] = useState<LabResult[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    api.labs
      .list(PATIENT_ID)
      .then(setResults)
      .catch((e) => setLoadError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(load, [load]);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      type: "creatinine",
      value: "",
      unit: LAB_UNITS.creatinine.canonical,
      takenAt: today(),
    },
  });

  const selectedType = useWatch({ control, name: "type" });
  const unitOptions = Object.keys(LAB_UNITS[selectedType].factors);

  const onSubmit = async (form: FormValues) => {
    // 1. forma modeli → API modeli
    const parsed = createLabSchema.safeParse({
      ...form,
      value: Number(form.value.replace(",", ".")),
    });

    // 2. ortaq sxemlə yoxla
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof FormValues, { message: issue.message });
      }
      return;
    }

    // 3. göndər
    try {
      await api.labs.create(PATIENT_ID, parsed.data);
      reset({ ...form, value: "" });
      load();
    } catch (e) {
      if (e instanceof ApiError && e.fieldErrors.length > 0) {
        e.fieldErrors.forEach((f) =>
          setError(f.field as keyof FormValues, { message: f.message }),
        );
      } else {
        setError("root", {
          message: e instanceof Error ? e.message : "Xəta baş verdi",
        });
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.label}>Analiz</Text>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <View style={styles.chips}>
              {LAB_TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    field.onChange(t);
                    setValue("unit", LAB_UNITS[t].canonical);
                  }}
                  style={[styles.chip, field.value === t && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      field.value === t && styles.chipTextActive,
                    ]}
                  >
                    {LAB_LABELS[t]}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />

        <Text style={styles.label}>Dəyər</Text>
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="decimal-pad"
              placeholder="məs. 1,8"
            />
          )}
        />
        {errors.value && (
          <Text style={styles.error}>{errors.value.message}</Text>
        )}

        <Text style={styles.label}>Vahid</Text>
        <Controller
          control={control}
          name="unit"
          render={({ field }) => (
            <View style={styles.chips}>
              {unitOptions.map((u) => (
                <Pressable
                  key={u}
                  onPress={() => field.onChange(u)}
                  style={[styles.chip, field.value === u && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      field.value === u && styles.chipTextActive,
                    ]}
                  >
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
        {errors.unit && <Text style={styles.error}>{errors.unit.message}</Text>}

        <Text style={styles.label}>Tarix (İİİİ-AA-GG)</Text>
        <Controller
          control={control}
          name="takenAt"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="2026-10-01"
            />
          )}
        />
        {errors.takenAt && (
          <Text style={styles.error}>{errors.takenAt.message}</Text>
        )}

        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

        <Pressable
          style={styles.button}
          onPress={() => void handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Göndərilir..." : "Əlavə et"}
          </Text>
        </Pressable>
      </View>

      {loadError && <Text style={styles.error}>{loadError}</Text>}
      {!results && !loadError && <ActivityIndicator />}

      {results?.map((r) => (
        <View key={r.id} style={styles.row}>
          <Text style={styles.rowTitle}>
            {LAB_LABELS[r.type]}: {r.value} {r.unit}
          </Text>
          <Text style={styles.rowMeta}>{r.takenAt}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#DCE3DF",
  },
  label: { fontSize: 13, fontWeight: "700", color: "#33433D", marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C5D0CB",
  },
  chipActive: { backgroundColor: "#0F5C55", borderColor: "#0F5C55" },
  chipText: { fontWeight: "600", color: "#14201C" },
  chipTextActive: { color: "#FFFFFF" },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C5D0CB",
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: { color: "#B42318", fontSize: 13 },
  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0F5C55",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  row: { padding: 14, borderRadius: 12, backgroundColor: "#F1F4F2", gap: 2 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowMeta: { color: "#4A5A54" },
});
