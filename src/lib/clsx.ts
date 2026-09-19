type ClassValue = string | number | false | null | undefined;

export default function clsx(...args: ClassValue[]): string {
  return args.filter(Boolean).join(" ");
}
