---
id: diagramas-de-venn
titulo: Diagramas de Venn
titulo_en: Venn diagrams
alias:
  - diagrama de Venn
  - regiones de Venn
modulo: 0
submodulo: '0.1'
orden: 7
nivel: basico
prerrequisitos:
  - operaciones-de-conjuntos
relaciones:
  - tipo: relacionado
    id: particiones-de-un-conjunto
etiquetas:
  - conjuntos
  - diagramas
  - regiones
  - representación visual
resumen: >
  Un diagrama de Venn representa conjuntos como regiones dentro de un rectángulo universal. Con k
  conjuntos hay 2^k regiones, una por cada combinación de pertenencia, y juntas parten el universo.
formula: '\#\text{regiones} = 2^{k}'
visualizacion:
  componente: VennSets
  parametros:
    modo: regiones
    universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    conjuntos:
      - etiqueta: A
        elementos: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
      - etiqueta: B
        elementos: [3, 6, 9, 12, 15, 18]
      - etiqueta: C
        elementos: [2, 3, 5, 7, 11, 13, 17, 19]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un club deportivo ofrece natación, ciclismo y carrera. Para planear horarios, la directora dibuja un rectángulo que representa a todos los socios y tres círculos superpuestos, uno por disciplina. Cada socio queda en exactamente un lugar del dibujo: dentro de los tres círculos si practica las tres disciplinas, en la parte de un solo círculo si practica solo esa, fuera de todos si no practica ninguna.

El dibujo tiene ocho zonas porque cada socio responde tres preguntas de sí o no, y hay ocho maneras de responderlas. Esa es la idea central de un diagrama de Venn: no es solo una figura, sino una forma de organizar a todo el universo según su pertenencia a varios conjuntos, sin dejar a nadie fuera ni contar a nadie dos veces. Cualquier combinación de uniones, intersecciones y complementos es simplemente una elección de zonas.

## Definición

Un **diagrama de Venn** para conjuntos $A_1, \dots, A_k \subseteq U$ es una representación en la que $U$ es un rectángulo, cada $A_i$ es una región cerrada y las regiones se superponen de modo que aparece una zona para cada una de las $2^k$ combinaciones de pertenencia.

Para cada vector $(\varepsilon_1, \dots, \varepsilon_k) \in \{0, 1\}^k$ la región correspondiente es

$$
R_{\varepsilon} = \bigcap_{i=1}^{k} A_i^{(\varepsilon_i)}, \qquad A_i^{(1)} = A_i,\quad A_i^{(0)} = A_i^c.
$$

:::nota
Con círculos solo se logra un diagrama de Venn completo para $k \le 3$. Para cuatro o más conjuntos se usan elipses u otras curvas, porque cuatro círculos no generan las 16 regiones.
:::

:::nota[Qué significa cada símbolo]
- $k$: número de conjuntos dibujados.
- $A_1, \dots, A_k$: los conjuntos; $U$: el universo, el rectángulo.
- $\varepsilon = (\varepsilon_1, \dots, \varepsilon_k)$: vector de ceros y unos que indica en qué conjuntos está una región ($1$ = dentro, $0$ = fuera).
- $R_{\varepsilon}$: la región con esa combinación de pertenencias.
- $A_i^{(1)} = A_i$ y $A_i^{(0)} = A_i^c$: el conjunto o su complemento.
- $\bigcap$: intersección de todos los factores.
:::

## Cómo usar la visualización

El universo son los números del 1 al 20, y los conjuntos son $A$ (pares), $B$ (múltiplos de 3) y $C$ (primos). Cada número aparece dentro de su región. La reproducción recorre las ocho regiones de adentro hacia afuera, sombreando una a la vez y describiendo su pertenencia; arriba se muestra la región como intersección de conjuntos y complementos. Un clic en cualquier zona salta a ella.

La región de los tres conjuntos está vacía: ningún número es par, múltiplo de 3 y primo a la vez. La región "en $A$ y en $C$, no en $B$" contiene solo al 2. La tabla de datos confirma que las ocho cantidades suman 20.

## Ejemplo

En una encuesta a 100 personas sobre plataformas de video, 60 usan la plataforma $A$, 45 la $B$ y 30 la $C$; 20 usan $A$ y $B$, 15 usan $A$ y $C$, 10 usan $B$ y $C$, y 5 usan las tres. Se llenan las regiones de adentro hacia afuera:

1. $A \cap B \cap C$: 5.
2. Solo $A$ y $B$: $20 - 5 = 15$. Solo $A$ y $C$: $15 - 5 = 10$. Solo $B$ y $C$: $10 - 5 = 5$.
3. Solo $A$: $60 - 15 - 10 - 5 = 30$. Solo $B$: $45 - 15 - 5 - 5 = 20$. Solo $C$: $30 - 10 - 5 - 5 = 10$.
4. Ninguna: $100 - (5 + 15 + 10 + 5 + 30 + 20 + 10) = 5$.

Así, 95 personas usan al menos una plataforma y 60 usan exactamente una.

:::figura[La encuesta del ejemplo con las regiones ya llenas. Las consultas suman las regiones de cada pregunta: 95 personas usan al menos una plataforma, 60 exactamente una y 5 ninguna.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [A, B, C]
universo: Encuestados
conteos:
  A: 30
  B: 20
  C: 10
  AB: 15
  AC: 10
  BC: 5
  ABC: 5
  ninguno: 5
consultas:
  - nombre: Al menos una
    regiones: [A, B, C, AB, AC, BC, ABC]
  - nombre: Exactamente una
    regiones: [A, B, C]
  - nombre: "A y B, con o sin C"
    regiones: [AB, ABC]
  - nombre: Solo A y B
    regiones: [AB]
  - nombre: Ninguna
    regiones: [ninguno]
```
:::

## Propiedades

- Las $2^k$ regiones son disjuntas y su unión es $U$: forman una partición del universo (algunas pueden estar vacías).
- Cualquier expresión con unión, intersección y complemento de los $A_i$ es la unión de ciertas regiones, así que hay $2^{2^k}$ conjuntos distintos que se pueden formar.
- Dos expresiones son iguales para todos los conjuntos si y solo si seleccionan las mismas regiones.
- Llenar las regiones desde la intersección de todos hacia afuera evita contar dos veces.

## Errores comunes

- **Usar los números de las intersecciones por pares como si fueran regiones exclusivas.** "20 usan $A$ y $B$" incluye a quienes también usan $C$.
- **Olvidar la región exterior.** Los elementos que no están en ningún conjunto también forman parte del universo.
- **Tomar las áreas como proporcionales a las cantidades.** En un diagrama de Venn usual las áreas no representan tamaños.
- **Pensar que un diagrama demuestra una igualdad con una configuración particular.** La demostración requiere comparar regiones, no un caso numérico.

## Conexiones

Cada región es una intersección de conjuntos y complementos, construida con las [[operaciones-de-conjuntos]]; las [[leyes-de-de-morgan]] se leen como igualdades entre regiones. Las regiones forman una de las [[particiones-de-un-conjunto]]. El conteo por regiones se generaliza en el principio de inclusión y exclusión, y en probabilidad las áreas de un diagrama pueden hacerse proporcionales a las probabilidades.

## Formulario

:::formula[Número de regiones]
$$
\#\text{regiones} = 2^{k}
$$

- $k$: número de conjuntos.
- $2$: cada región está dentro o fuera de cada conjunto.
:::

:::formula[Región de una combinación de pertenencias]
$$
R_{\varepsilon} = \bigcap_{i=1}^{k} A_i^{(\varepsilon_i)}, \qquad A_i^{(1)} = A_i,\quad A_i^{(0)} = A_i^c
$$

- $\varepsilon_i$: 1 si la región está dentro de $A_i$ y 0 si está fuera.
- $A_i^c$: complemento de $A_i$.
:::

:::formula[Conjuntos que se pueden formar]
$$
\#\text{expresiones distintas} = 2^{2^{k}}
$$

- $2^k$: número de regiones.
- Cada expresión con uniones, intersecciones y complementos es la unión de algunas regiones.
:::

:::formula[Regiones que suman el universo]
$$
|U| = \sum_{\varepsilon} |R_{\varepsilon}|
$$

- $|U|$: tamaño del universo.
- $|R_{\varepsilon}|$: número de elementos de cada región; la suma recorre las $2^k$ regiones.
:::
