'use client';

import React, { useCallback } from 'react';
import HeaderIconTextItem from "@/components/navigation/HeaderIconTextItem";
import { faHexagon } from "@fortawesome/free-solid-svg-icons";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import ButtonHeaderItem from "@/components/navigation/ButtonHeaderItem";
import CommandCenterDialog from "@/components/navigation/command-center/CommandCenterDialog";

type CommandCenterButtonProps = {

};

const CommandCenterButton: React.FunctionComponent<CommandCenterButtonProps> = () => {
  const openDialog = useOpenDialog();

  const handleClick = useCallback(() => {
    openDialog(CommandCenterDialog, undefined);
  }, [openDialog]);

  return (
    <ButtonHeaderItem
      onClick={handleClick}
    >
      <HeaderIconTextItem
        icon={faHexagon}
      >
        Command Center
      </HeaderIconTextItem>
    </ButtonHeaderItem>
  );
};

export default CommandCenterButton;
