import React from 'react';
import { EShortCodeType } from "@/services/material-tracing/short-code.type";
import Badge from "@/components/universals/badge/badge.component";

type ShortCodeTypeBadgeProps = {
  type: EShortCodeType;
};

const ShortCodeTypeBadge: React.FunctionComponent<ShortCodeTypeBadgeProps> = ({
  type,
}) => {
  switch (type) {
    case EShortCodeType.MATERIAL:
      return (
        <Badge>
          Material
        </Badge>
      );
    case EShortCodeType.PART:
      return (
        <Badge>
          Part
        </Badge>
      );
    default:
      return null;
  }
};

export default ShortCodeTypeBadge;
