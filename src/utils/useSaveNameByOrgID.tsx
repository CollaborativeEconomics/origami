import useOrigamiStore from '@/store/useOrigamiStore';
import { useQuery } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';
import fetchRegistry from './fetchRegistry';

const useSaveNameByOrgID = (
  walletID: string,
  key: 'recipientName' | 'senderName',
) => {
  const { setCurrent } = useOrigamiStore();
  const { data } = useQuery({
    queryKey: ['orgByWalletAddress', walletID],
    queryFn: () => fetchRegistry(`organizations?wallet=${walletID}`),
  });
  useEffect(() => {
    const name = data?.data?.[0]?.name;
    if (data) {
      setCurrent(key, name);
    }
  }, [data]);
};

export default useSaveNameByOrgID;
