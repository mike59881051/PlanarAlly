import { sendClientOptions } from "@/game/api/utils";
import { LocalPoint } from "@/game/geom";
import { layerManager } from "@/game/layers/manager";
import { gameStore } from "@/game/store";
import Tool from "@/game/ui/tools/tool.vue";
import Component from "vue-class-component";
import { ToolBasics } from "./ToolBasics";
import { ToolName } from "./utils";

@Component
export default class PanTool extends Tool implements ToolBasics {
    name = ToolName.Pan;
    panStart = new LocalPoint(0, 0);
    active = false;

    panScreen(target: LocalPoint, full: boolean): void {
        const distance = target.subtract(this.panStart).multiply(1 / gameStore.zoomFactor);
        gameStore.increasePanX(Math.round(distance.x));
        gameStore.increasePanY(Math.round(distance.y));
        this.panStart = target;
        if (full) layerManager.invalidateAllFloors();
        else layerManager.invalidateVisibleFloors();
    }

    onMove(lp: LocalPoint): void {
        if (!this.active) return;
        this.panScreen(lp, false);
    }

    onDown(lp: LocalPoint): void {
        this.panStart = lp;
        this.active = true;
    }

    onUp(lp: LocalPoint): void {
        if (!this.active) return;
        this.active = false;
        this.panScreen(lp, true);
        sendClientOptions(gameStore.locationUserOptions);
    }
}
