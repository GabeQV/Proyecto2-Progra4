package com.example.backend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {"/{path:^(?!api|assets)[^\\.]*}", "/{path:^(?!api|assets)[^\\.]*}/**"})
    public String spa() {
        return "forward:/index.html";
    }
}
