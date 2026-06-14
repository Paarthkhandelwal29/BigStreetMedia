import type { Icon } from "@phosphor-icons/react";
import {
  Signpost,
  Bus,
  Megaphone,
  Storefront,
  Confetti,
  Kanban,
  RadioButton,
  Television,
  FilmSlate,
  DeviceMobile,
  UsersThree,
  Plant,
  MapPin,
  Handshake,
  Lightning,
  GearSix,
  CurrencyInr,
  ChartLineUp,
  ShoppingCart,
  Car,
  Buildings,
  Bank,
  Heartbeat,
  GraduationCap,
  FlagBanner,
  Boat,
} from "@phosphor-icons/react/dist/ssr";

/** Named icon registry — keeps data files free of component imports. */
export const icons = {
  // services
  billboard: Signpost,
  bus: Bus,
  megaphone: Megaphone,
  store: Storefront,
  star: Confetti,
  exhibition: Kanban,
  radio: RadioButton,
  tv: Television,
  cinema: FilmSlate,
  phone: DeviceMobile,
  influencer: UsersThree,
  tractor: Plant,
  // value props
  map: MapPin,
  handshake: Handshake,
  lightning: Lightning,
  gear: GearSix,
  rupee: CurrencyInr,
  chart: ChartLineUp,
  // industries
  fmcg: ShoppingCart,
  automobile: Car,
  realestate: Buildings,
  bfsi: Bank,
  healthcare: Heartbeat,
  telecom: DeviceMobile,
  education: GraduationCap,
  retail: Storefront,
  government: FlagBanner,
  // signature
  boat: Boat,
} satisfies Record<string, Icon>;

export type IconName = keyof typeof icons;
