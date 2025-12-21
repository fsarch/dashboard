import React, { PropsWithChildren, ReactElement } from 'react';
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";

type ListItemProps = PropsWithChildren<{
  left?: ReactElement | null;
  right?: ReactElement | null;
  href: string;
}>;

const LinkListItem: React.FunctionComponent<ListItemProps> = ({
  children,
  right,
  left,
  href,
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
    >
      <ListItem
        left={left}
        right={right}
      >
        {children}
      </ListItem>
    </Link>
  );
};

export default LinkListItem;
