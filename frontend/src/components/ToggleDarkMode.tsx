import React, { useRef, useLayoutEffect, useState, useId } from "react";
import { gsap } from "gsap";
import { EasePack } from "gsap/EasePack";
import { IoMoonOutline } from "react-icons/io5";
import "./ToggleDarkMode.css";

gsap.registerPlugin(EasePack);

type AnimationVariant = "elastic" | "rough";

interface ToggleDarkModeProps {
  label?: string;
  variant?: AnimationVariant;
  random?: boolean;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}

const getAnimationConfig = (variant: AnimationVariant) => {
  if (variant === "rough") {
    return {
      duration: 0.4,
      offset: 0.015,
      ease: "rough({ strength: 5, points: 20 })",
    };
  }
  return {
    duration: 1.8,
    offset: 0.015,
    ease: "elastic.out(1.4, 0.4)",
  };
};

const ToggleDarkMode: React.FC<ToggleDarkModeProps> = ({
  label,
  variant = "elastic",
  random = true,
  onChange,
  defaultChecked = false,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const switchRef = useRef<SVGGElement>(null);
  const ctx = useRef<gsap.Context>(null);

  const uniqueId = useId();
  const patternId = `gradient-pattern-${uniqueId}`;

  const randomizeArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useLayoutEffect(() => {
    ctx.current = gsap.context(() => { }, switchRef);
    return () => ctx.current?.revert();
  }, []);

  useLayoutEffect(() => {
    ctx.current?.add(() => {
      if (!switchRef.current) return;

      const config = getAnimationConfig(variant);
      let nodes = Array.from(switchRef.current.children);

      if (random) {
        nodes = randomizeArray(nodes);
      }

      gsap.to(nodes, {
        duration: config.duration,
        ease: config.ease,
        x: checked ? 48 : 0,
        stagger: config.offset,
        overwrite: true,
      });
    });
  }, [checked, variant, random]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    if (onChange) onChange(newValue);
  };

  const renderSwitchSlices = () => {
    const slices = [];
    const iconSize = 24;
    const startX = 6;
    const startY = 6;
    const sliceHeight = 2;
    const totalSlices = 12;

    for (let i = 0; i < totalSlices; i++) {
      const clipId = `moon-clip-${uniqueId}-${i}`;
      const currentY = startY + i * sliceHeight;

      slices.push(
        <g key={i} className="slice">
          <defs>
            <clipPath id={clipId}>
              <rect x={startX} y={currentY} width={iconSize} height={sliceHeight} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <IoMoonOutline
              color={checked ? "#76b3fa" : "#7e7f87"}
              x={startX}
              y={startY}
              size={iconSize}
              className="moon-icon"
            />
          </g>
        </g>
      );
    }
    return slices;
  };

  return (
    <div className="input-container">
      <label htmlFor={uniqueId}>
        <input
          id={uniqueId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          aria-labelledby={`label-${uniqueId}`}
        />
        <div className="svg-wrap">
          <svg
            height="36"
            width="84"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                width="1"
                height="4"
              >
                <rect width="100%" height="2" fill="#181a29" />
                <rect y="2" width="100%" height="2" fill="#202436" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="84" height="36" fill={`url(#${patternId})`} />

            <g className="switch" ref={switchRef}>
              {renderSwitchSlices()}
            </g>
          </svg>
        </div>
        <span id={`label-${uniqueId}`}>{label}</span>
      </label>
    </div>
  );
};

export default ToggleDarkMode;