export type AnimationVariant = "elastic" | "rough";

export type ToggleDarkModeProps = {
  label?: string;
  variant?: AnimationVariant;
  random?: boolean;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}