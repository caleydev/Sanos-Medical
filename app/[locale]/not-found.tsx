import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");
  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="text-secondary text-6xl font-bold">404</p>
      <p className="text-muted mt-4 text-lg">{t("notFound")}</p>
      <Link
        href="/"
        className="text-primary mt-8 font-semibold underline underline-offset-4"
      >
        {t("backToHome")}
      </Link>
    </main>
  );
}
