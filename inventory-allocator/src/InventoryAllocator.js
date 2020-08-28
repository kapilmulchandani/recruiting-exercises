class InventoryAllocator {

    constructor(order, listOfWarehouses) {
        this.ordersMap = order;
        this.listOfWarehousesMap = listOfWarehouses;
    }

    get order() {
        return this.ordersMap;
    }

    set order(newOrder) {
        this.ordersMap = newOrder;
    }

    get listOfWarehouses() {
        return this.listOfWarehousesMap;
    }

    set listOfWarehouses(newListOfWarehouses) {
        this.listOfWarehousesMap = newListOfWarehouses;
    }

    concatResults(array) {
        var output = [];
        array.forEach(function (item) {
            var existing = output.filter(function (v, i) {
                return v.name == item.name;
            });
            if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].items = Object.assign(output[existingIndex].items, item.items);
            } else {
                output.push(item);
            }
        });
        return output
    }

    bestWayToShip() {
        let finalResult = [];
        let intermediateResult = [];
        if (this.ordersMap === null || this.listOfWarehousesMap === null) {
            return finalResult;
        }

        this.ordersMap.forEach((quantity, item) => {
            for (var warehouse of this.listOfWarehousesMap) {
                if (quantity <= warehouse.inventory[item]) {
                    if (intermediateResult != []) {
                        Array.prototype.push.apply(finalResult, intermediateResult);
                    }
                    finalResult.push({ 'name': warehouse.name, "items": { [item]: quantity } });
                    warehouse.inventory[item] -= quantity;
                    intermediateResult = [];
                    break;
                }
                else if (quantity > warehouse.inventory[item] && warehouse.inventory[item] > 0) {

                    intermediateResult.push({ 'name': warehouse.name, "items": { [item]: warehouse.inventory[item] } });
                    quantity = quantity - warehouse.inventory[item];
                    warehouse.inventory[item] = 0;

                }
            }
            intermediateResult = [];
        });
        return this.concatResults(finalResult);
    }
}

exports.InventoryAllocator = InventoryAllocator;