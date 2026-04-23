import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Snowflake, Users } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const todayStr = () => new Date().toISOString().split("T")[0];

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  email: z.string().trim().email("Invalid email address").max(255),
  package: z.enum(["basic", "premium", "vip"], { message: "Please choose a package" }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((d) => d >= todayStr(), { message: "Date must be today or later" }),
});

type FormValues = z.infer<typeof schema>;

export const BookingModal = ({ open, onOpenChange }: Props) => {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", package: undefined, date: "" },
  });

  const pkg = watch("package");

  const onSubmit = (_values: FormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      reset();
      toast.success(t("book.toast.title"), { description: t("book.toast.desc") });
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-ice/20 max-w-md">
        <DialogHeader className="text-center items-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-ice shadow-ice mb-2">
            <Snowflake className="h-7 w-7 text-night" strokeWidth={2.5} />
          </div>
          <DialogTitle className="text-2xl font-black text-frost">{t("book.title")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{t("book.desc")}</DialogDescription>
          <div className="inline-flex items-center gap-2 text-xs text-gold mt-1">
            <Users className="h-3.5 w-3.5" />
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-pulse-soft" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {t("book.viewing")}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2" noValidate>
          <div>
            <Input placeholder={t("book.field.name")} className="bg-mid/50 border-border/60 h-11" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Input type="tel" placeholder={t("book.field.phone")} className="bg-mid/50 border-border/60 h-11" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div>
            <Input type="email" placeholder={t("book.field.email")} className="bg-mid/50 border-border/60 h-11" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Select
              value={pkg}
              onValueChange={(v) => setValue("package", v as FormValues["package"], { shouldValidate: true })}
            >
              <SelectTrigger className="bg-mid/50 border-border/60 h-11">
                <SelectValue placeholder={t("book.field.package")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">{t("book.opt.basic")}</SelectItem>
                <SelectItem value="premium">{t("book.opt.premium")}</SelectItem>
                <SelectItem value="vip">{t("book.opt.vip")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.package && <p className="mt-1 text-xs text-destructive">{errors.package.message}</p>}
          </div>
          <div>
            <Input
              type="date"
              min={todayStr()}
              className="bg-mid/50 border-border/60 h-11"
              {...register("date")}
            />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-gold text-night font-black shadow-gold hover:shadow-lift transition-spring text-base">
            {loading ? t("book.sending") : t("book.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
