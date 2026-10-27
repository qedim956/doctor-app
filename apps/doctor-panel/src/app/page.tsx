import { Suspense } from "react";
import { PatientForm } from "./patient-form";
import { DeletePatientButton } from "./delete-patient-button";

type Patient = {
  id: string;
  fullName: string;
  birthDate: string;
  sex: string;
  age: number;
};

async function PatientList() {
  const res = await fetch(`${process.env.API_URL}/patients`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Xəstələri yükləmək olmadı");
  const patients: Patient[] = await res.json();



  return (
    <ul className="grid gap-2">
      {patients.map((p) => (
        <li key={p.id}>
          {p.fullName}, {p.age} yaş
          <DeletePatientButton id={p.id} name={p.fullName} />
        </li>
      ))}
    </ul>
  );
}


export default async function Home() {

  return (
    <main style={{ padding: 32, maxWidth: 720, display: "grid", gap: 24 }}>
      <h1>Xəstələr</h1>
      <PatientForm />
      <Suspense fallback={<p className="text-muted-foreground">Yüklənir...</p>}>
        <PatientList />
      </Suspense>
    </main>
  );
}
