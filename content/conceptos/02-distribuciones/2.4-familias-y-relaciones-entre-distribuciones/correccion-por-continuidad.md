---
id: correccion-por-continuidad
titulo: Corrección por continuidad
titulo_en: Continuity correction
alias:
  - corrección de Yates
  - ajuste de media unidad
modulo: 2
submodulo: '2.4'
orden: 9
nivel: intermedio
prerrequisitos:
  - aproximacion-normal-a-la-binomial
relaciones:
  - tipo: relacionado
    id: aproximacion-normal-a-la-binomial
etiquetas:
  - aproximación
  - discreta y continua
  - binomial
  - normal
  - media unidad
resumen: >
  Al aproximar una distribución discreta con una continua, cada valor entero k se representa con el
  intervalo de k - 0.5 a k + 0.5. Ampliar los extremos media unidad reduce mucho el error.
formula: 'P(a \le X \le b) \approx P(a - 0.5 \le Y \le b + 0.5), \qquad X \text{ discreta},\ Y \text{ continua}'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: continuidad
    valores:
      n: 20
      p: 0.5
      a: 8
      b: 12
    casos:
      - nombre: 'Caras en 20 volados'
        descripcion: 'P(8 ≤ X ≤ 12): exacta 0.7368; sin corrección 0.6289 y con corrección 0.7364. Las barras de los extremos quedan cortadas a la mitad si no se corrige.'
        valores: {n: 20, p: 0.5, a: 8, b: 12}
      - nombre: 'Un solo valor'
        descripcion: 'P(X = 10): sin corrección el intervalo de 10 a 10 tiene área cero; con corrección se integra de 9.5 a 10.5 y da 0.1769 frente a 0.1762 exacto.'
        valores: {n: 20, p: 0.5, a: 10, b: 10}
      - nombre: 'Muestra grande'
        descripcion: 'n = 100: las barras son angostas frente a la campana y la corrección importa mucho menos.'
        valores: {n: 100, p: 0.5, a: 45, b: 55}
referencias:
  - clave: ross-probabilidad
  - clave: agresti
publicado: true
---

## Intuición

Una binomial vive en los enteros: su histograma es una fila de barras de ancho uno centradas en 0, 1, 2, etc. La barra del 8 ocupa el intervalo de 7.5 a 8.5. Cuando se aproxima la binomial con una curva normal, la probabilidad de un valor entero corresponde al área bajo la curva sobre el ancho de su barra, no sobre un punto.

Por eso, para calcular $P(8 \le X \le 12)$ con la normal hay que integrar desde 7.5 hasta 12.5: así se cubren completas las barras del 8 y del 12. Si se integra de 8 a 12, se queda fuera la mitad de cada barra extrema y la aproximación sale baja. Esa ampliación de media unidad en cada extremo es la corrección por continuidad.

La corrección importa más cuando hay pocos valores en juego, porque media barra es una fracción grande del total, y deja de importar cuando $n$ es tan grande que las barras son finísimas comparadas con el ancho de la campana. En el caso extremo de un solo valor, sin corrección el área es cero; con corrección es la barra completa.

## Definición

:::definicion[Corrección por continuidad]
Sea $X$ una variable con valores enteros aproximada por una variable continua $Y$ (por ejemplo, una binomial aproximada por una normal). Para enteros $a \le b$:
$$
P(a \le X \le b) \approx P(a - 0.5 \le Y \le b + 0.5), \qquad P(X = k) \approx P(k - 0.5 \le Y \le k + 0.5).
$$
Las desigualdades estrictas se convierten primero en no estrictas: $P(X < b) = P(X \le b - 1) \approx P(Y \le b - 0.5)$ y $P(X > a) = P(X \ge a + 1) \approx P(Y \ge a + 0.5)$.
:::

:::nota[Qué es X]
$X$ = una variable discreta con valores enteros, como el número de caras en 20 volados, que se aproxima con una normal continua $Y$.
:::

:::nota[Qué hace cada parámetro]
- **$a$, $b$, extremos:** el intervalo de enteros cuya probabilidad se busca. Si se acercan entre sí, la corrección pesa más en el resultado.
- **$n$, número de ensayos:** el tamaño de la binomial. Si aumenta, cada barra es más pequeña en relación con la campana y la corrección cambia menos la respuesta.
- **Interruptor de corrección:** cambia el área sombreada entre $[a, b]$ y $[a - 0.5, b + 0.5]$.
:::

:::nota[Qué significa cada símbolo]
- $X$: variable discreta; $Y$: variable continua que la aproxima.
- $a$, $b$, $k$: enteros; $0.5$: media unidad, la mitad del ancho de una barra.
:::

## Cómo usar la visualización

Las barras son la binomial y las del intervalo elegido aparecen más intensas; la curva es la normal con la misma media y varianza, y el área sombreada es la que usa la aproximación. El interruptor activa o desactiva la corrección; el panel compara la probabilidad exacta con las dos aproximaciones y sus errores. Los casos cargan caras en 20 volados, un solo valor y una muestra grande.

Apaga la corrección y observa que el área deja fuera media barra en cada extremo. Carga "Un solo valor" y comprueba que sin corrección la aproximación es cero. Con la muestra grande, compara los errores: casi no cambian.

## Ejemplo

Se lanzan 20 volados; $X \sim \operatorname{Bin}(20, 0.5)$, con media 10 y desviación $\sqrt{5} \approx 2.236$. Se busca $P(8 \le X \le 12)$.

1. Exacta: $\sum_{k=8}^{12}\binom{20}{k}0.5^{20} \approx 0.7368$.
2. Sin corrección: $\Phi\!\left(\frac{12 - 10}{2.236}\right) - \Phi\!\left(\frac{8 - 10}{2.236}\right) = \Phi(0.894) - \Phi(-0.894) \approx 0.6289$; el error es $-0.108$.
3. Con corrección: $\Phi\!\left(\frac{12.5 - 10}{2.236}\right) - \Phi\!\left(\frac{7.5 - 10}{2.236}\right) = \Phi(1.118) - \Phi(-1.118) \approx 0.7364$; el error es $-0.0004$.
4. Para un solo valor, $P(X = 10)$: exacta 0.1762, con corrección $\Phi(0.224) - \Phi(-0.224) \approx 0.1769$, sin corrección 0.

:::figura[Caras en 20 volados: el área normal de 7.5 a 12.5 cubre completas las barras del 8 al 12 y da 0.7364 frente a 0.7368 exacto. El interruptor muestra el área sin corrección, de 8 a 12.]{componente="FamilyLab"}
```yaml
modo: continuidad
valores:
  n: 20
  p: 0.5
  a: 8
  b: 12
```
:::

## Propiedades

- **Barras como intervalos:** asignar a cada entero $k$ el intervalo $[k - 0.5, k + 0.5]$ convierte la masa discreta en un histograma de densidad comparable con la curva.
- **Error:** con la corrección, el error de la aproximación normal a la binomial baja de orden $1/\sqrt{n}$ a orden $1/n$ cuando $p = 1/2$.
- **Desigualdades estrictas:** primero se pasa a enteros, $X < b$ como $X \le b - 1$, y después se corrige.
- **Tamaño grande:** cuando $\sqrt{np(1 - p)}$ es grande, media unidad es despreciable frente a la desviación y la corrección casi no cambia el resultado.
- **Otras aproximaciones:** se aplica igual a la Poisson aproximada por la normal y a estadísticos de conteo como la chi-cuadrada de tablas 2 por 2 (corrección de Yates).

:::figura[Casos con contexto (20 volados, un solo valor, muestra grande): cada botón carga n, p y el intervalo, y una frase compara las aproximaciones.]{componente="FamilyLab"}
```yaml
modo: continuidad
valores:
  n: 20
  p: 0.5
  a: 10
  b: 10
casos:
  - nombre: 'Caras en 20 volados'
    descripcion: 'Error de -0.108 sin corrección y de -0.0004 con ella.'
    valores: {n: 20, p: 0.5, a: 8, b: 12}
  - nombre: 'Un solo valor'
    descripcion: 'Sin corrección el área es cero.'
    valores: {n: 20, p: 0.5, a: 10, b: 10}
  - nombre: 'Muestra grande'
    descripcion: 'Con n = 100 la diferencia es menor.'
    valores: {n: 100, p: 0.5, a: 45, b: 55}
```
:::

## Errores comunes

- **Corregir en la dirección equivocada.** Para $P(X \ge 60)$ se usa 59.5, no 60.5; el intervalo se amplía para incluir completa la barra del extremo.
- **Corregir después de cambiar una desigualdad estricta.** $P(X > 7)$ es $P(X \ge 8)$ y se aproxima con 7.5, no con 8.5 ni con 7.
- **Aplicarla a variables continuas.** Si la variable ya es continua no hay barras que completar; la corrección solo tiene sentido al aproximar una discreta.
- **Pensar que basta para cualquier $n$.** La corrección mejora la aproximación, pero no arregla la asimetría cuando $np$ es chico.

:::figura[Sin corrección para un solo valor: con el interruptor apagado, P(X = 10) se vuelve el área de 10 a 10, que es cero; con la corrección es la barra completa.]{componente="FamilyLab"}
```yaml
modo: continuidad
valores:
  n: 20
  p: 0.5
  a: 10
  b: 10
```
:::

## Conexiones

Mejora la [[aproximacion-normal-a-la-binomial]], que es un caso del [[teorema-central-del-limite]], y se aplica también al aproximar la [[distribucion-de-poisson]] con la [[distribucion-normal]]. Se basa en leer la masa de la [[distribucion-binomial]] como un histograma de barras de ancho uno. En pruebas sobre tablas de contingencia aparece como corrección de Yates. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas aproximaciones.

## Formulario

:::formula[Intervalo]
$$
P(a \le X \le b) \approx P(a - 0.5 \le Y \le b + 0.5)
$$

- $X$: discreta; $Y$: continua aproximante; $a$, $b$: enteros.
:::

:::formula[Un solo valor]
$$
P(X = k) \approx P(k - 0.5 \le Y \le k + 0.5)
$$

- $k$: entero.
:::

:::formula[Binomial con normal]
$$
P(a \le X \le b) \approx \Phi\!\left(\frac{b + 0.5 - np}{\sqrt{np(1 - p)}}\right) - \Phi\!\left(\frac{a - 0.5 - np}{\sqrt{np(1 - p)}}\right)
$$

- $n$: ensayos; $p$: probabilidad de éxito; $\Phi$: normal estándar.
:::

:::formula[Desigualdades estrictas]
$$
P(X < b) \approx P(Y \le b - 0.5), \qquad P(X > a) \approx P(Y \ge a + 0.5)
$$

- Se pasa primero a $X \le b - 1$ o $X \ge a + 1$.
:::
