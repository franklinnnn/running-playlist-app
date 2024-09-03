"use client";
import Link from "next/link";
import { useAccessToken } from "../hooks/useAccessToken";

export const Footer = () => {
  const { accessToken } = useAccessToken();
  return (
    <footer className="relative footer items-center p-4 mt-24 max-w-xl font-body">
      <aside className="grid-flow-col items-center">
        <p className="text-xs">
          {new Date().getFullYear()} Made by{" "}
          <Link
            href="https://franklinnn.com"
            className="text-secondary hover:text-primary"
          >
            Franklin Assa
          </Link>{" "}
        </p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end text-xs">
        <Link
          href={accessToken ? "/dashboard" : "/"}
          className="text-secondary hover:text-primary"
        >
          Home
        </Link>
        <Link href="/about" className="text-secondary hover:text-primary">
          About
        </Link>
        <Link href="/privacy" className="text-secondary hover:text-primary">
          Privacy Policy
        </Link>
        <Link href="/contact" className="text-secondary hover:text-primary">
          Contact
        </Link>
      </nav>
    </footer>
  );
};
