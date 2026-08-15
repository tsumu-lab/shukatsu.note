// クリックした座標が、テキストの何文字目にあたるかを計算する
export function getClickOffset(e: React.MouseEvent): number {
  const doc = document as any;

  if (doc.caretRangeFromPoint) {
    // Chrome, Safari
    const range = doc.caretRangeFromPoint(e.clientX, e.clientY);
    return range ? range.startOffset : 0;
  }

  if (doc.caretPositionFromPoint) {
    // Firefox
    const pos = doc.caretPositionFromPoint(e.clientX, e.clientY);
    return pos ? pos.offset : 0;
  }

  return 0;
}