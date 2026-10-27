"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPatientSchema, type CreatePatientInput } from "@clinic/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApiValidationError = { field: string; message: string };

export function PatientForm() {
  const router = useRouter();

  const form = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      sex: undefined,
    },
  });

  const { handleSubmit, control, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (values: CreatePatientInput) => {
    let res: Response;
    try {
      res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      form.setError("root", {
        message: "Serverə qoşulmaq olmadı. Bir az sonra yenidən cəhd edin.",
      });
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const apiErrors: ApiValidationError[] = body?.errors ?? [];
      if (apiErrors.length > 0) {
        apiErrors.forEach((e) =>
          form.setError(e.field as keyof CreatePatientInput, {
            message: e.message,
          }),
        );
      } else {
        form.setError("root", {
          message: "Xəta baş verdi. Yenidən cəhd edin.",
        });
      }
      return;
    }

    form.reset();
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni xəstə</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Ad, soyad</Label>
            <Input id="fullName" {...form.register('fullName')} aria-invalid={!!errors.fullName} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate">Doğum tarixi</Label>
            <Input id="birthDate" type="date" {...form.register('birthDate')} aria-invalid={!!errors.birthDate} />
            {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sex">Cins</Label>
            <Controller
              control={form.control}
              name="sex"
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger id="sex" aria-invalid={!!errors.sex}>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Kişi</SelectItem>
                    <SelectItem value="female">Qadın</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sex && <p className="text-sm text-destructive">{errors.sex.message}</p>}
          </div>

          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Göndərilir...' : 'Əlavə et'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
