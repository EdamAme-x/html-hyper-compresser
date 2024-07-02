import { bench, run } from "mitata";
import { HTMLLexer } from "../lexer";

bench("Small Lexer", () => {
  HTMLLexer("<div></div>");
});

bench("Small Lexer 2", () => {
  HTMLLexer("<div>a<span /></div>");
});

bench("Medium Lexer", () => {
  HTMLLexer("<div class=\"test\" id='abc'>test<span x /></div>");
});

bench("Large Lexer", () => {
  HTMLLexer(`<div class="test" id='abc'>test<span x /></div>
<div class="test" id='abc'>test<span x /></div>
<div class="test" id='abc'>test<span x=1 /></div>`);
});

bench("Largest Lexer", () => {
  HTMLLexer(`<div class="test" id='abc'>test<span x /></div>
<div class="test" id='abc'>test<span x /></div>
<div class="test" id='abc'>test<span x=1 /></div>`.repeat(100));
});

await run();