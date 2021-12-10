package com.tahir.puzzle15online.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@Slf4j
public class ViewController {

    @RequestMapping(value = {"/", "/index"}, method = RequestMethod.GET)
    public String mapRoot() {
        return "index";
    }

    @RequestMapping(value = {"/offline"}, method = RequestMethod.GET)
    public String mapPuzzle1p() {
        return "puzzle-1p";
    }

    @RequestMapping(value = {"/online"}, method = RequestMethod.GET)
    public String mapPuzzle2p() {
        return "puzzle-2p";
    }
}
