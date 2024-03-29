//Manage timeout for tooltip
let timeoutId;

//Load tooltip at page lodd
export function loadToolTip(id) {
  timeoutId = setTimeout(() => {
    hideTooltip(id);
  }, 600);
}

//Clear timeout for tooltip
export function clearTooltipTimeout() {
    clearTimeout(timeoutId);
}

//Show tool tip after mouse enter. Allows for dynamic text and tooltips
export function showTooltip(id, e, tooltip_text) {
  const x = e.clientX - tooltip_text.length * 3;
  const y = e.clientY + 10;
  const tooltip = document.getElementById(`tooltip-${id}`);

  timeoutId = setTimeout(() => {
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.textContent = tooltip_text;
    tooltip.style.visibility = "visible";
  }, 600);
}

//Hide tooltip after mouse exit
export function hideTooltip(id) {
  clearTimeout(timeoutId);
  const tooltip = document.getElementById(`tooltip-${id}`);
  tooltip.style.visibility = "hidden";
}
