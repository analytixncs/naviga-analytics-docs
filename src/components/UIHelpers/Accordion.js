import React, { useEffect, useState } from "react";
import { AiOutlineRightCircle } from "react-icons/ai";
import { useSpring, animated } from "@react-spring/web";

export const Accordion = ({ children, title, titleSize = "md" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const titleEm = titleSize === "md" ? "1.3em" : "1.5em";

  const [opacity, api2] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
  }));

  const [transform, api] = useSpring(() => ({}));

  const [hovered, setHovered] = useState(false);

  const hoverProps = useSpring({
    transform: hovered ? "scale(1.2)" : "scale(1)",
  });

  useEffect(() => {
    if (isOpen) {
      api.start({
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(90deg)" },
        config: { duration: 300 },
      });
      api2.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 600 },
      });
    } else {
      api.start({
        from: { transform: "rotate(90deg)" },
        to: { transform: "rotate(0deg)" },
        config: { duration: 300 },
      });
      api2.start({
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: { duration: 600 },
      });
    }
  }, [isOpen]);

  return (
    <div
      style={{ padding: "15px 0", margin: "10px 0" }}
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <animated.div
          style={{
            ...transform,
            transformOrigin: "50% 50%",
            display: "flex",
            padding: 0,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AiOutlineRightCircle size="1.8em" />
        </animated.div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <span
            style={{
              fontSize: titleEm,
              fontWeight: "bold",
              marginLeft: "15px",
            }}
          >
            {title}
          </span>
          <div
            style={{
              borderBottom: "1px solid black",
              marginLeft: "12px",
              // alignSelf: "flex-end",
            }}
          />
        </div>
      </div>
      {isOpen && (
        <animated.div style={{ ...opacity, marginLeft: "45px" }}>
          {children}
        </animated.div>
      )}
    </div>
  );
};
