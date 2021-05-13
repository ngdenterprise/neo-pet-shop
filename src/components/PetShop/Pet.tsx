import React from "react";

type Props = {
  petId: number;
  isHungry: boolean;
  owner?: string;
  lastFed: Date;
};

/**
 * Renders an individual pet
 */
export default function Pet({ petId, isHungry, owner, lastFed }: Props) {
  return (
    <div style={{ margin: 10, padding: 10, textAlign: "center" }}>
      <div>
        <strong>Pet {petId}</strong>
      </div>
      {isHungry && (
        <div>
          <em>I'm hungry!</em>
        </div>
      )}
      <div>Last fed: {`${lastFed}`}</div>
      {!!owner && <div>Owner: {owner}</div>}
    </div>
  );
}
