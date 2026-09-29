---
id: supremo-e-infimo
titulo: Supremo e ínfimo
titulo_en: Supremum and infimum
alias:
  - supremo
  - ínfimo
  - mínima cota superior
  - máxima cota inferior
  - axioma del supremo
modulo: 0
submodulo: '0.1'
orden: 22
nivel: intermedio
prerrequisitos:
  - sucesiones
etiquetas:
  - números reales
  - cotas
  - completitud
  - supremo
resumen: >
  El supremo de un conjunto es su menor cota superior y el ínfimo su mayor cota inferior. A diferencia del
  máximo, el supremo existe para todo conjunto no vacío y acotado de reales, aunque no pertenezca al conjunto.
formula: 's = \sup S \iff (\forall x \in S:\ x \le s) \land (\forall \varepsilon > 0\ \exists x \in S:\ x > s - \varepsilon)'
visualizacion:
  componente: SequenceSeries
  parametros:
    modo: supremo
    conjunto: uno-menos-inverso
    conjuntos:
      - uno-menos-inverso
      - alternante
      - cociente
      - raices-de-dos
    epsilon: 0.05
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un laboratorio mide la eficiencia de un motor que se mejora en versiones sucesivas: 50 %, 75 %, 87.5 %, ... cada versión cubre la mitad de lo que le falta a la anterior para llegar a 100 %. Ninguna versión alcanza el 100 %, así que el conjunto de eficiencias no tiene un valor máximo: para cualquier versión hay otra mejor. Sin embargo, hay un número que describe su techo con precisión: 100 %. Ninguna versión lo supera, y cualquier número menor que 100 %, sea 99.9 % o 99.999 %, es superado por alguna versión.

Ese techo exacto es el supremo. Es la menor de todas las cotas superiores: 120 % también es un techo, pero no ajustado. El ínfimo es la idea análoga desde abajo. La propiedad fundamental de los números reales, que no tienen los racionales, es que todo conjunto no vacío y acotado tiene un supremo real: no hay "huecos" en la recta.

## Definición

Sea $S \subseteq \mathbb{R}$ no vacío. Un número $u$ es **cota superior** de $S$ si $x \le u$ para todo $x \in S$; $S$ es **acotado superiormente** si tiene alguna.

:::definicion[Supremo e ínfimo]
El **supremo** $\sup S$ es la menor cota superior de $S$: es cota superior, y si $u$ es cualquier cota superior, $\sup S \le u$. Equivalentemente, $s = \sup S$ si y solo si
$$
x \le s\ \ \forall x \in S \quad \text{y} \quad \forall \varepsilon > 0\ \exists x \in S:\ x > s - \varepsilon.
$$
El **ínfimo** $\inf S$ es la mayor cota inferior. Si $\sup S \in S$, se llama **máximo**; si $\inf S \in S$, **mínimo**.
:::

:::teorema[Axioma del supremo]
Todo subconjunto no vacío de $\mathbb{R}$ acotado superiormente tiene supremo en $\mathbb{R}$.
:::

## Cómo usar la visualización

Los elementos del conjunto aparecen uno por uno sobre la recta. La zona a la derecha del supremo contiene todas las cotas superiores, y el intervalo $(\sup S - \varepsilon, \sup S]$ se resalta. El panel indica el supremo, el ínfimo, si el supremo es máximo y el primer elemento que entra al intervalo resaltado.

Con $S = \{1 - 1/n\}$ y $\varepsilon = 0.05$ el primer elemento dentro del intervalo aparece en $n = 21$. Al reducir $\varepsilon$ el testigo tarda más, pero siempre aparece: eso distingue al supremo de cualquier cota más grande. Con $\{(-1)^n/n\}$ el supremo es $1/2$ y sí pertenece al conjunto, así que es un máximo. Los truncamientos decimales de $\sqrt{2}$ son racionales, pero su supremo no lo es.

## Ejemplo

Sea $S = \left\{\frac{n}{n + 1} : n \in \mathbb{N}\right\} = \left\{\frac{1}{2}, \frac{2}{3}, \frac{3}{4}, \dots\right\}$, la fracción de lotes aprobados de una línea de producción que mejora con cada ajuste.

1. **Cota superior.** $\frac{n}{n + 1} < 1$ para todo $n$, así que 1 es cota superior.
2. **Es la menor.** Dado $\varepsilon > 0$, se busca $n$ con $\frac{n}{n + 1} > 1 - \varepsilon$, es decir, $\frac{1}{n + 1} < \varepsilon$. Basta $n > \frac{1}{\varepsilon} - 1$. Con $\varepsilon = 0.01$, $n = 100$ da $\frac{100}{101} \approx 0.9901 > 0.99$.
3. Por tanto $\sup S = 1$, y como $1 \notin S$, $S$ no tiene máximo.
4. **Ínfimo.** La sucesión es creciente, así que $\inf S = \frac{1}{2}$, que sí pertenece a $S$: es el mínimo.

:::figura[El conjunto del ejemplo, $n/(n + 1)$, sobre la recta. Toda la zona desde 1 hacia la derecha son cotas superiores y, para cualquier distancia $\varepsilon$, algún elemento cae entre $1 - \varepsilon$ y 1; el supremo 1 no pertenece al conjunto.]{componente="SequenceSeries"}
```yaml
modo: supremo
conjunto: cociente
epsilon: 0.01
```
:::

## Propiedades

- El supremo, si existe, es único.
- Si $S$ tiene máximo, el máximo es el supremo.
- $\inf S = -\sup(-S)$, donde $-S = \{-x : x \in S\}$.
- Si $A \subseteq B$, entonces $\sup A \le \sup B$ e $\inf A \ge \inf B$.
- **Convergencia monótona:** una sucesión creciente y acotada converge a $\sup_n a_n$.
- En $\mathbb{Q}$ el axioma falla: $\{x \in \mathbb{Q} : x^2 < 2\}$ está acotado pero no tiene supremo racional.
- Por convención, $\sup S = +\infty$ si $S$ no está acotado superiormente.

:::demostracion
Para la unicidad, si $s$ y $s'$ son ambos menores cotas superiores, entonces $s \le s'$ porque $s'$ es cota y $s$ la menor, y $s' \le s$ por el mismo argumento. Así $s = s'$.
:::

## Errores comunes

- **Confundir supremo con máximo.** El supremo puede no pertenecer al conjunto; el máximo siempre pertenece.
- **Tomar cualquier cota superior como supremo.** 2 es cota de $\{1 - 1/n\}$, pero no la menor.
- **Pensar que el supremo es el último elemento.** En un conjunto infinito puede no haber último elemento.
- **Creer que todo conjunto acotado de racionales tiene supremo racional.** La completitud es una propiedad de $\mathbb{R}$.

:::figura[Un conjunto de racionales sin supremo racional: los truncamientos decimales de $\sqrt{2}$ se acumulan contra $\sqrt{2}$, que es irracional. En $\mathbb{R}$ el supremo existe; en $\mathbb{Q}$ no.]{componente="SequenceSeries"}
```yaml
modo: supremo
conjunto: raices-de-dos
epsilon: 0.005
```
:::

## Conexiones

El supremo garantiza la convergencia de las [[sucesiones]] monótonas acotadas, y con ella la convergencia de las [[series-y-convergencia-de-series|series]] de términos positivos cuyas sumas parciales están acotadas. Su definición usa [[cuantificadores-universal-y-existencial|cuantificadores]] con la misma estructura que la definición de límite. En estadística, el estadístico de Kolmogorov y Smirnov es el supremo de la distancia entre dos funciones de distribución, y en probabilidad los extremos del soporte de una variable se definen como supremo e ínfimo.
