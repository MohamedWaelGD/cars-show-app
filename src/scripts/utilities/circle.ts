import { Vector3 } from "three";

export function calculatePointsOnCircle(
    centerX: number,
    centerY: number,
    radius: number,
    numberOfPoints: number
) {
    var angleIncrement = (2 * Math.PI) / numberOfPoints;
    var points = [];

    for (var i = 0; i < numberOfPoints; i++) {
        var angle = i * angleIncrement;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        points.push({ x: x, y: 0, z: y });
    }

    return points;
}

export function calculateDistance(point1: Vector3, point2: Vector3) {
    var dx = point2.x - point1.x;
    var dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
