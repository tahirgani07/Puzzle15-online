package com.tahir.puzzle15online.model;

public class Shared {
    public static Grid START_GRID = new Grid(
            new int[][]{
                    {1, 2, 3, 4},
                    {5, 6, 7, 8},
                    {9, 10, 11, 12},
                    {13, 14, 15, 0}
            },
            new int[]{3, 3}
    );

    public static Grid TMP_GRID = new Grid(
            new int[][]{
                    {1, 2, 3, 4},
                    {5, 6, 7, 8},
                    {9, 10, 11, 12},
                    {13, 14, 0, 15}
            },
            new int[]{3, 2}
    );
    public static Grid TMP_GRID2 = new Grid(
            new int[][]{
                    {1, 2, 3, 4},
                    {5, 6, 7, 8},
                    {9, 10, 11, 12},
                    {13, 14, 0, 15}
            },
            new int[]{3, 2}
    );
}
