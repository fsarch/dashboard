import React from 'react';
import { TIcon } from "@/components/universals/icon/Icon.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

type IconProps = {
  icon: TIcon;
  className?: string;
};

const Icon: React.FunctionComponent<IconProps> = ({
  icon,
  className,
}) => {
  if (typeof icon === "string") {
    return (
      <FontAwesomeIcon
        className={className}
        icon={icon}
      />
    );
  }

  return (
    <span className={className}>
      <span className="fa-layers">
        {icon.icons.map((icon, index) => (
          <FontAwesomeIcon
            icon={icon.icon}
            key={index}
            transform={icon.transform}
            color={icon.color}
          />
        ))}
      </span>
    </span>
  );
};

export default Icon;
