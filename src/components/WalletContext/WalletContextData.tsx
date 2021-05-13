type WalletContextData = {
  pets: { petId: number; isHungry: boolean; owner?: string; lastFed: Date }[];
};

export default WalletContextData;
