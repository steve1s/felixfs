import Link from "next/link";
import Image from "next/image";
import fileImage from "../app/Felix-Signature.jpg";

const nav = [
  { href: "/", label: "Home" },
  { href: "/seasonal", label: "What's in season" },
  { href: "/recipes", label: "Recipes" },
  { href: "/scan", label: "Scan ingredients" },
];

export function Header() {
  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={fileImage} alt="fslogo" className="h-15 w-30" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-emerald-800 transition hover:text-emerald-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/scan"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Scan now
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-emerald-100 bg-emerald-950 text-emerald-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm">
          Recipes sourced from{" "}
          <a
            href="https://fareshare.org.uk/recipes/"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            fareshare.org.uk/recipes
          </a>
          . Fighting hunger, tackling food waste.
        </p>
      </div>
    </footer>
  );
}
