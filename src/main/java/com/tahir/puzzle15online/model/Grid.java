package com.tahir.puzzle15online.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Grid {
    int[][] grid;
    int[] emptyPos;
}
