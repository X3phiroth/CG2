/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: kdtree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "vec2", "Scene", "KdNode", "BoundingBox"], (function (KdUtil, vec2, Scene, KdNode, BoundingBox) {

    "use strict";

    /**
     * Creates a kd-tree. The build function is directly called
     * on generation
     *
     * @param pointList
     * @constructor
     */
    var KdTree = function (pointList) {

        /**
         *
         * @param pointList - list of points
         * @param dim       - current axis
         * @param parent    - current parent (starts with root)
         * @param isLeft    - flag if node is left or right child of its parent
         * @returns returns root node after tree is build
         */
        this.build = function (pointList, dim, parent, isLeft) {

            // IMPLEMENT!
            // create new node
            var node = new KdNode(dim);

            // find median position in pointList
            var median = KdUtil.median(pointList, dim);

            // compute next axis
            var nextDim;
            if (dim === 0) {
                nextDim = 1;
            } else {
                nextDim = 0;
            }

            // set point in node
            node.point = pointList[median];

            // compute bounding box for node
            // check if node is root (has no parent)
            if (!parent) {
                var xmax = parseInt($("#drawing_area").attr("width"));
                var ymax = parseInt($("#drawing_area").attr("height"));
                node.bbox = new BoundingBox(0, 0, xmax, ymax, node.point, dim); // or maybe 1, 1 as min??
            } else {
                // create bounding box and distinguish between axis and
                // which side (left/right) the node is on
                if (isLeft) {
                    parent.leftChild = node; // Correct here?
                    if (dim === 0) {
                        var xmin = parent.bbox.xmin;
                        var ymin = parent.bbox.ymin;
                        var xmax = parent.point.center[0];
                        var ymax = parent.bbox.ymax;
                        node.bbox = new BoundingBox(xmin, ymin, xmax, ymax, node.point, dim);
                    } else /* Top BoundingBox*/ {
                        var xmin = parent.bbox.xmin;
                        var ymin = parent.point.center[1];
                        var xmax = parent.bbox.xmax;
                        var ymax = parent.bbox.ymax;
                        node.bbox = new BoundingBox(xmin, ymin, xmax, ymax, node.point, dim);
                    }
                } else {
                    parent.rightChild = node; // Correct here?
                    if (dim === 0) {
                        var xmin = parent.point.center[0]; // Correct??
                        var ymin = parent.bbox.ymin;
                        var xmax = parent.bbox.xmax;
                        var ymax = parent.bbox.ymax;
                        node.bbox = new BoundingBox(xmin, ymin, xmax, ymax, node.point, dim);
                    } else /* Bottom BoundingBox*/ {
                        var xmin = parent.bbox.xmin;
                        var ymin = parent.bbox.ymin;
                        var xmax = parent.bbox.xmax;
                        var ymax = parent.point.center[1]; // Correct??
                        node.bbox = new BoundingBox(xmin, ymin, xmax, ymax, node.point, dim);
                    }
                }
            }

            // create point list left/right and
            // call build for left/right arrays
            var l1 = median - 1;
            if (l1 > 0) {
                var leftList = new Array();
                for (var i = 0; i < median; i++) {
                    leftList[i] = pointList[i];;
                }
                this.build(leftList, nextDim, node, true);
            }
            ;

            var l2 = pointList.length - median;
            if (l2 > 0) {
                var rightList = new Array();
                var rightCount = 0;
                for (var j = median + 1; i < pointList.length; j++) {
                    rightList[rightCount] = pointList[j];
                    rightCount++;
                }
                this.build(rightList, nextDim, node, false);
            }

            // return root node
            return node;
        };

        /**
         * Given a query point the function return its nearest neighbor by traversing
         * down the tree
         *
         * @param node - current tree node
         * @param query - query node
         * @param nearestDistance - current nearest distance to query node
         * @param currentBest - current best/nearest node to query node
         * @param dim - current axis (x or y)
         * @returns closest tree node to query node
         */
        this.findNearestNeighbor = function (node, query, nearestDistance, currentBest, dim) {

            if (!node) {
                return currentBest;
            }

            var closest = currentBest;
            var closestDistance = nearestDistance;

            var dist = KdUtil.distance(node.point.center, query.center);
            if (dist < nearestDistance) {
                closestDistance = dist;
                closest = node;
            }

            var first, second;
            if (dim === 0) {
                if (query.center[0] < node.point.center[0]) {
                    first = node.leftChild;
                    second = node.rightChild;
                } else {
                    first = node.rightChild;
                    second = node.leftChild;
                }
            } else {
                if (query.center[1] < node.point.center[1]) {
                    first = node.leftChild;
                    second = node.rightChild;
                } else {
                    first = node.rightChild;
                    second = node.leftChild;
                }
            }

            var nextDim = (dim === 0) ? 1 : 0;
            if (first && first.bbox.distanceTo(query.center) < closestDistance) {
                closest = this.findNearestNeighbor(first, query, closestDistance, closest, nextDim);
                closestDistance = KdUtil.distance(closest.point.center, query.center);
            }

            if (second && second.bbox.distanceTo(query.center) < closestDistance) {
                closest = this.findNearestNeighbor(second, query, closestDistance, closest, nextDim);
            }

            return closest;
        };


        //
        this.root = this.build(pointList, 0);
        console.log(" this is the root: ", this.root);

    };

    return KdTree;


})); // define


