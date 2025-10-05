import React from "react";

interface MyBidsProps {
  wallet: string;
}

export default function MyBids({ wallet: _wallet }: MyBidsProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">My Bids</h2>
      <p className="text-gray-600">No active bids found.</p>
    </div>
  );
}
