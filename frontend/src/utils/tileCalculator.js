export const DEFAULT_WASTE_RATE = 8;

export function calculateTileEstimate({ length, width, wasteRate = DEFAULT_WASTE_RATE, price = 0, coveragePerBox = 1.44 }) {
  const roomLength = Number(length);
  const roomWidth = Number(width);
  const waste = Number(wasteRate);
  const unitPrice = Number(price);
  const boxCoverage = Number(coveragePerBox);

  if (![roomLength, roomWidth, waste, unitPrice, boxCoverage].every(Number.isFinite)
    || roomLength <= 0 || roomWidth <= 0 || waste < 0 || waste > 30 || boxCoverage <= 0) {
    return null;
  }

  const area = roomLength * roomWidth;
  const requiredArea = area * (1 + waste / 100);
  const boxes = Math.ceil(requiredArea / boxCoverage);
  const purchaseArea = boxes * boxCoverage;

  return {
    area: Number(area.toFixed(2)),
    requiredArea: Number(requiredArea.toFixed(2)),
    boxes,
    purchaseArea: Number(purchaseArea.toFixed(2)),
    estimatedTotal: Number((purchaseArea * unitPrice).toFixed(2))
  };
}
