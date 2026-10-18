import { calcBmi } from "@clinic/domain";

export default function Home() {
  const bmi = calcBmi(78, 172);
  return (
    <main style={{ padding: 32 }}>
      <h1>Həkim paneli</h1>
      <p>Domain paketindən BMI: {bmi.toFixed(1)}</p>
    </main>
  );
}