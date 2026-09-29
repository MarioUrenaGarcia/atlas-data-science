---
id: variaciones
titulo: Variaciones
titulo_en: k-permutations (partial permutations)
alias:
  - permutaciones parciales
  - variaciones sin repetición
  - variaciones con repetición
  - arreglos de k en n
modulo: 0
submodulo: '0.2'
orden: 7
nivel: basico
prerrequisitos:
  - permutaciones
etiquetas:
  - conteo
  - orden
  - selección
  - repetición
resumen: >
  Una variación es una selección ordenada de k objetos tomados de n. Sin repetición hay n!/(n - k)!
  variaciones; si los objetos pueden repetirse, hay n^k.
formula: 'V(n, k) = \frac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1),\qquad VR(n, k) = n^{k}'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: ordenaciones
    objetos: [Río, Sol, Luz, Mar, Paz, Fe]
    k: 3
    permitirRepeticion: true
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

En una final de natación compiten seis nadadoras y se reparten medallas de oro, plata y bronce. ¿Cuántos podios distintos puede haber? El oro puede ganarlo cualquiera de las seis; la plata, cualquiera de las cinco restantes; el bronce, cualquiera de las cuatro que quedan. Hay $6 \cdot 5 \cdot 4 = 120$ podios. Es como una permutación que se detiene antes de terminar: se ordenan solo tres de las seis.

Si en lugar de medallas se tratara de un código de tres símbolos elegidos entre seis, donde un símbolo puede repetirse, cada posición tendría las seis opciones completas y habría $6^3 = 216$ códigos. La diferencia entre ambos conteos está en una sola pregunta: ¿un objeto puede ocupar más de una posición?

Las dos situaciones comparten que el orden importa: el podio (Ana, Beto, Caro) es distinto de (Beto, Ana, Caro), y el código 1-2-3 es distinto de 3-2-1.

## Definición

:::definicion[Variaciones]
Una **variación sin repetición** de $k$ elementos tomados de un conjunto de $n$ es una sucesión $(a_1, \dots, a_k)$ de elementos distintos del conjunto. Una **variación con repetición** es una sucesión de longitud $k$ cuyos términos pertenecen al conjunto y pueden repetirse.
:::

:::teorema
Para $0 \le k \le n$,
$$
V(n, k) = n(n-1)\cdots(n-k+1) = \frac{n!}{(n-k)!},
$$
y para cualquier $k \ge 0$, $VR(n, k) = n^{k}$.
:::

Las variaciones sin repetición son las funciones inyectivas de $\{1, \dots, k\}$ en el conjunto; las variaciones con repetición son todas las funciones.

## Cómo usar la visualización

Las casillas representan las $k$ posiciones y debajo de cada una aparece cuántos objetos están disponibles para ella. La reproducción lista todas las variaciones y muestra la última en las casillas. Los controles cambian el número de objetos disponibles $n$, el número de posiciones $k$ y si se permite repetir.

Sin repetición, con $n = 6$ y $k = 3$, las opciones por posición son 6, 5 y 4, y la lista tiene 120 elementos. Al permitir repetición, cada casilla vuelve a tener 6 opciones y la lista crece a 216. Con $k = n$ y sin repetición se recuperan las permutaciones.

## Ejemplo

Un sistema de acceso de un hospital usa códigos de 4 dígitos (del 0 al 9).

1. **Con repetición:** cada posición tiene 10 opciones: $10^4 = 10000$ códigos.
2. **Sin dígitos repetidos:** $V(10, 4) = 10 \cdot 9 \cdot 8 \cdot 7 = 5040$ códigos.
3. **Códigos con al menos un dígito repetido:** por complemento, $10000 - 5040 = 4960$, casi la mitad.
4. La proporción de códigos sin repetición es $5040 / 10000 = 0.504$; este tipo de cálculo es la base de la paradoja del cumpleaños.

:::figura[Los códigos del ejemplo. Con repetición cada dígito tiene 10 opciones y hay 10000 códigos; sin repetición las opciones bajan a 10, 9, 8 y 7, y hay 5040.]{componente="CombinatoricsBoard"}
```yaml
modo: casillas
escenarios:
  - nombre: Con repetición
    casillas:
      - etiqueta: dígito 1
        opciones: 10
      - etiqueta: dígito 2
        opciones: 10
      - etiqueta: dígito 3
        opciones: 10
      - etiqueta: dígito 4
        opciones: 10
  - nombre: Sin repetición
    casillas:
      - etiqueta: dígito 1
        opciones: 10
      - etiqueta: dígito 2
        opciones: 9
      - etiqueta: dígito 3
        opciones: 8
      - etiqueta: dígito 4
        opciones: 7
```
:::

## Propiedades

- **Casos extremos:** $V(n, n) = n!$, $V(n, 1) = n$, $V(n, 0) = 1$, y $V(n, k) = 0$ si $k > n$.
- **Relación con combinaciones:** $V(n, k) = \binom{n}{k}\, k!$, porque cada selección ordenada es un subconjunto de $k$ elementos junto con uno de sus $k!$ órdenes.
- **Factorial descendente:** $V(n, k)$ se escribe también $n^{\underline{k}}$ o $(n)_k$.
- **Proporción sin repetición:** $\frac{V(n, k)}{n^k} = \prod_{i=0}^{k-1}\left(1 - \frac{i}{n}\right)$, que decrece rápidamente con $k$.

## Errores comunes

- **Usar $n^k$ cuando los objetos no pueden repetirse.** Un podio no puede tener a la misma nadadora en dos lugares.
- **Usar variaciones cuando el orden no importa.** Si los tres primeros lugares solo clasifican a la siguiente ronda sin distinción, se trata de combinaciones.
- **Confundir $n^k$ con $k^n$.** En un código de 4 posiciones con 10 dígitos hay $10^4$ códigos, no $4^{10}$.

## Conexiones

Las variaciones generalizan las [[permutaciones]] a selecciones de solo $k$ objetos y se cuentan con el [[principio-del-producto]]. Al olvidar el orden se obtienen las [[combinaciones]], y las variaciones sin repetición corresponden a las funciones inyectivas de [[funciones-inyectivas-suprayectivas-y-biyectivas]]. En probabilidad, el muestreo ordenado con y sin reemplazo se cuenta exactamente con $n^k$ y con $V(n, k)$.
