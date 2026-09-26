'use client';

import { faHexagon } from '@fortawesome/free-solid-svg-icons';
import type React from 'react';
import { useCallback } from 'react';
import ButtonHeaderItem from '@/components/navigation/ButtonHeaderItem';
import CommandCenterDialog from '@/components/navigation/command-center/CommandCenterDialog';
import HeaderIconTextItem from '@/components/navigation/HeaderIconTextItem';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';

type CommandCenterButtonProps = {};

const CommandCenterButton: React.FunctionComponent<
  CommandCenterButtonProps
> = () => {
  const openDialog = useOpenDialog();

  const handleClick = useCallback(() => {
    openDialog(CommandCenterDialog, undefined);
  }, [openDialog]);

  return (
    <ButtonHeaderItem onClick={handleClick}>
      <HeaderIconTextItem icon={faHexagon}>Command Center</HeaderIconTextItem>
    </ButtonHeaderItem>
  );
};

export default CommandCenterButton;
