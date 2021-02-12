import { useEffect, useState } from "react";
import { useInput } from "./useInput";
// import "./index.css";
import _ from "lodash";

/*
const esDinner = (14.95+12.99) / 2

const prices = [esDinner, esDinner, 14.99]

const subtotal = prices.reduce((acc, cur) => acc + cur, 0)

const total = 55.28

const taxAndTip = total - subtotal

const portionWeights = prices.map(x => x / subtotal)

const portionTotalSplits = portionWeights.map(x => x * total)

console.log({ subtotal, taxAndTip });

console.log('portionWeights', portionWeights, portionWeights.reduce((acc, cur) => acc + cur, 0))

console.log('portionTotalSplits', portionTotalSplits.map(x => x.toFixed(2)), portionTotalSplits.reduce((acc, cur) => acc + cur, 0))
*/

function LineItem(props) {
  const { item, onDelete, onUpdate, totalSplit } = props;
  const { value: cost, bind: bindCost, reset: resetCost } = useInput(item.cost);
  const { value: owners, bind: bindOwners, reset: resetOwners } = useInput(
    item.owners
  );
  useEffect(() => {
    const newItem = Object.freeze({
      ...item,
      cost: parseInt(cost, 10),
      owners
    });
    onUpdate(newItem);
  }, [cost, owners]);
  return (
    <>
      <label>
        Item Cost:
        <input type="number" {...bindCost} />
        Owners:
        <input type="text" {...bindOwners} />
        Total Split: {Number(totalSplit).toFixed(2)}
        <br/>
      </label>
      <input type="button" value="-" onClick={onDelete} />
      <br />
    </>
  );
}

function makeItem() {
  return Object.freeze({ cost: 0, owners: "", id: _.uniqueId() });
}

export default function App() {
  const [lineItems, setLineItems] = useState([makeItem()]);
  const { value: total, bind: bindTotal, reset: resetTotal } = useInput("");

  const prices = lineItems.map((item) => item.cost);
  const subtotal = prices.reduce((acc, cur) => acc + cur, 0);
  const taxAndTip = total - subtotal;
  const portionWeights = prices.map((x) => x / subtotal);
  const portionTotalSplits = portionWeights.map((x) => x * total);

  useEffect(() => {
    console.log({ prices, subtotal, taxAndTip });

    console.log(
      "portionWeights",
      portionWeights,
      portionWeights.reduce((acc, cur) => acc + cur, 0)
    );
  
    console.log(
      "portionTotalSplits",
      portionTotalSplits.map((x) => x.toFixed(2)),
      portionTotalSplits.reduce((acc, cur) => acc + cur, 0)
    );
  });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    alert(`Submitting Total ${total}`);
    resetTotal();
  };

  const onAddItem = () => {
    setLineItems([...lineItems, makeItem()]);
  };

  const onDeleteItem = (index) => () => {
    const newItems = [...lineItems];
    _.pullAt(newItems, index);
    setLineItems(newItems);
  };

  const onUpdateItem = (item) => {
    const itemIndex = _.findIndex(lineItems, (x) => x.id === item.id);
    const newItems = [...lineItems];
    newItems[itemIndex] = item;
    setLineItems(newItems);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <p>
          {lineItems.map((item, index) => (
            <LineItem
              key={item.id}
              item={item}
              totalSplit={portionTotalSplits[index]}
              onDelete={onDeleteItem(index)}
              onUpdate={onUpdateItem}
            />
          ))}
          <input type="button" value="Add Item" onClick={onAddItem} />
        </p>
        <p>
          Subtotal: {subtotal}
          <br />
          Tax & Tip: {taxAndTip}
          <br />
          <label>
            Grand Total:
            <input type="number" {...bindTotal} />
          </label>
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
