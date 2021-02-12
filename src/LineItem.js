import { useEffect } from "react";
import { useInput } from "./useInput";
import { toDollarAmount } from './utils';

export function LineItem(props) {
  const { item, onDelete, onUpdate, totalSplit } = props;
  const { value: cost, bind: bindCost, reset: resetCost } = useInput(item.cost);
  const { value: owners, bind: bindOwners, reset: resetOwners } = useInput(
    item.owners
  );
  useEffect(() => {
    const newItem = Object.freeze({
      ...item,
      cost: parseFloat(cost),
      owners
    });
    onUpdate(newItem);
  }, [cost, owners]); // Don't trust the linter, the app breaks if you add more dependencies here due to infinite recursion
  return (
    <>
      <label>
        Item Cost:
        $<input type="number" {...bindCost} />
        Owners:
        <input type="text" {...bindOwners} />
        Total Split: {toDollarAmount(totalSplit)}
        <br/>
      </label>
      <input type="button" value="-" onClick={onDelete} />
      <br />
    </>
  );
}