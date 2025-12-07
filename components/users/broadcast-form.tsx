/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const broadcastSchema = z
  .object({
    title: z
      .string()
      .min(3, "حداقل ۳ کاراکتر")
      .max(100, "حداکثر ۱۰۰ کاراکتر"),
    message: z
      .string()
      .min(10, "حداقل ۱۰ کاراکتر")
      .max(2000, "حداکثر ۲۰۰۰ کاراکتر"),
    audience: z.enum(["all", "active", "paid"]),
    // این دو مقدار دیگر اختیاری نیستند
    sendEmail: z.boolean(),
    sendSms: z.boolean(),
  })
  .refine(
    (data) => data.sendEmail || data.sendSms,
    {
      message: "حداقل یک کانال (ایمیل یا پیامک) را انتخاب کنید.",
      path: ["sendEmail"], // فقط برای نمایش ارور روی فرم
    }
  );

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

type Props = {
  defaultAudience?: "all" | "active" | "paid";
};

export function BroadcastForm({ defaultAudience = "all" }: Props) {
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: defaultAudience,
      sendEmail: true,
      sendSms: false,
    },
  });

  const onSubmit: SubmitHandler<BroadcastFormValues> = (values) => {
    // اینجا بعداً TanStack Query + API Core اضافه می‌کنیم
    console.log("Broadcast payload:", values);
    toast.success("پیام همگانی (به‌صورت تستی) ارسال شد.");
    form.reset({ ...values, title: "", message: "" });
  };

  const { errors } = form.formState;

  const audience = form.watch("audience");
  const sendEmail = form.watch("sendEmail");
  const sendSms = form.watch("sendSms");

  return (
    <Card className="rounded-2xl shadow-soft border border-border/80 bg-surface">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          ارسال پیام همگانی
        </CardTitle>
        <p className="mt-1 text-xs text-gray-500">
          ارسال اطلاعیه برای همه کاربران یا گروهی مثل کاربران فعال یا پرداخت‌شده.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* عنوان */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700">
                عنوان پیام
              </label>
              <Input
                {...form.register("title")}
                placeholder="مثلاً: به‌روزرسانی سرویس Permia"
                className="bg-white"
              />
              {errors.title && (
                <p className="text-[11px] text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* مخاطب */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700">
                مخاطب
              </label>
              <Select
                value={audience}
                onValueChange={(v) =>
                  form.setValue(
                    "audience",
                    v as BroadcastFormValues["audience"]
                  )
                }
              >
                <SelectTrigger className="bg-white h-9 rounded-xl text-xs md:text-sm">
                  <SelectValue placeholder="انتخاب مخاطب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه کاربران</SelectItem>
                  <SelectItem value="active">
                    فقط کاربران فعال
                  </SelectItem>
                  <SelectItem value="paid">
                    کاربرانی که حداقل یک خرید دارند
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* متن پیام */}
          <div className="space-y-1">
            <label className="text-xs text-gray-700">
              متن پیام
            </label>
            <Textarea
              {...form.register("message")}
              rows={5}
              placeholder="متن پیام همگانی را اینجا بنویسید..."
              className="bg-white text-sm"
            />
            {errors.message && (
              <p className="text-[11px] text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* کانال‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted px-3 py-2">
              <div>
                <p className="text-xs font-medium">ارسال ایمیل</p>
                <p className="text-[11px] text-gray-500">
                  پیام به ایمیل ثبت‌شده کاربران ارسال می‌شود.
                </p>
              </div>
              <Switch
                checked={sendEmail}
                onCheckedChange={(checked) =>
                  form.setValue("sendEmail", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted px-3 py-2">
              <div>
                <p className="text-xs font-medium">ارسال پیامک</p>
                <p className="text-[11px] text-gray-500">
                  نیازمند اتصال به سرویس SMS است.
                </p>
              </div>
              <Switch
                checked={sendSms}
                onCheckedChange={(checked) =>
                  form.setValue("sendSms", checked)
                }
              />
            </div>
          </div>

          {errors.sendEmail && !sendEmail && !sendSms && (
            <p className="text-[11px] text-red-500">
              {errors.sendEmail.message}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.reset()}
            >
              پاک کردن فرم
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-accent-50 px-6"
            >
              ارسال پیام
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
