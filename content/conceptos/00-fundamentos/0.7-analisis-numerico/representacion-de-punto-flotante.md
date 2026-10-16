---
id: representacion-de-punto-flotante
titulo: Representación de punto flotante
titulo_en: Floating point representation
alias:
  - punto flotante
  - IEEE 754
  - precisión doble
  - épsilon de máquina
modulo: 0
submodulo: '0.7'
orden: 1
nivel: intermedio
prerrequisitos:
  - serie-geometrica
etiquetas:
  - punto flotante
  - redondeo
  - precisión
  - épsilon de máquina
resumen: >
  Las computadoras guardan los números reales como signo, exponente y una fracción binaria de longitud
  fija; casi ningún decimal se guarda exacto, y la separación entre números representables crece con su tamaño.
formula: 'x = (-1)^{s} \cdot 1.f_1 f_2 \dots f_p{}_{\,2} \cdot 2^{e}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: flotante
    valor: 0.1
    formato: float32
referencias:
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Una regla graduada en milímetros no puede marcar 0.35 mm: cualquier longitud se redondea a la marca más cercana. Una computadora mide los números reales con una regla parecida, con dos diferencias. Las marcas están en binario, y su separación no es fija: cerca de cero están muy juntas y se van separando conforme los números crecen, de modo que el error relativo, el error comparado con el tamaño del número, es casi el mismo en toda la regla.

Por eso un número se guarda como en la notación científica: un signo, una mantisa con un número fijo de cifras binarias y un exponente que dice dónde va el punto. Con 52 cifras binarias en la mantisa, el formato de precisión doble distingue unas 16 cifras decimales. Lo que no cabe se redondea. Incluso un decimal tan simple como 0.1 tiene una expansión binaria infinita, $0.000110011\ldots_2$, y se guarda con un error pequeño pero real: por eso $0.1 + 0.2$ no da exactamente $0.3$ en la computadora.

## Definición

:::definicion[Número de punto flotante normalizado]
En base 2 con $p$ bits de fracción, un número de punto flotante normalizado es
$$
x = (-1)^{s} \cdot \Big(1 + \sum_{i=1}^{p} f_i\, 2^{-i}\Big) \cdot 2^{e}, \qquad f_i \in \{0, 1\},\quad e_{\min} \le e \le e_{\max}.
$$
El estándar IEEE 754 usa $p = 23$ y exponentes de 8 bits en precisión simple (32 bits), y $p = 52$ y exponentes de 11 bits en precisión doble (64 bits). El exponente se guarda sumándole un sesgo, 127 o 1023, para que sea un entero no negativo.
:::

El **épsilon de máquina** es $\varepsilon = 2^{-p}$, la distancia entre 1 y el siguiente número representable: $\varepsilon \approx 1.19 \times 10^{-7}$ en simple y $\varepsilon \approx 2.22 \times 10^{-16}$ en doble. Al redondear al más cercano, $\mathrm{fl}(x) = x(1 + \delta)$ con $|\delta| \le \varepsilon/2$ para todo $x$ dentro del rango.

Los valores con exponente mínimo y bit inicial 0 son **subnormales**, que llenan el hueco cerca de cero; los exponentes reservados representan $\pm\infty$ y NaN, "no es un número".

:::nota[Qué significa cada símbolo]
- $s$: bit de signo, 0 para positivo y 1 para negativo.
- $f_1, \dots, f_p$: bits de la fracción; $p$: número de bits de fracción.
- $e$: exponente sin sesgo; $e_{\min}$, $e_{\max}$: sus límites en el formato.
- $1.f_1 \dots f_p{}_2$: mantisa o significando en binario, con el 1 inicial implícito.
- $\varepsilon$: épsilon de máquina.
- $\mathrm{fl}(x)$: número de punto flotante más cercano a $x$; $\delta$: error relativo del redondeo.
:::

## Cómo usar la visualización

La fila de casillas muestra los bits del número escrito: el signo en rosa, el exponente en naranja y la fracción en azul. La animación agrega los bits de la fracción uno por uno y el encabezado escribe el valor parcial de la mantisa por la potencia de 2, que se acerca al valor guardado. Las lecturas comparan ese valor guardado con el decimal escrito: error de redondeo, error relativo, épsilon y distancia al siguiente número representable. Los controles cambian el número y el formato.

Al pasar 0.1 de precisión simple a doble, el error de redondeo baja de $1.5 \times 10^{-9}$ a $5.6 \times 10^{-18}$. Con un número como 6.25, la fracción termina en ceros y el error es cero.

## Ejemplo

Se guarda $x = 6.25$ en precisión doble.

1. En binario, $6 = 110_2$ y $0.25 = 0.01_2$, así que $6.25 = 110.01_2$.
2. Se normaliza moviendo el punto dos lugares: $110.01_2 = 1.1001_2 \cdot 2^2$; el exponente es $e = 2$ y se guarda como $2 + 1023 = 1025$.
3. La fracción es $1001$ seguida de 48 ceros: cabe completa en los 52 bits.
4. El valor guardado es $(1 + \tfrac{1}{2} + \tfrac{1}{16}) \cdot 4 = 1.5625 \cdot 4 = 6.25$, sin error.
5. En cambio, $0.1 = 1.6 \cdot 2^{-4}$ y $0.6$ en binario es $0.1001\,1001\,1001\ldots_2$, periódico: los 52 bits lo cortan y se guarda $0.1000000000000000055511\ldots$

:::figura[6.25 en precisión doble: después de los bits 1001 la fracción solo tiene ceros, así que el valor parcial llega a 6.25 a los cuatro bits y el error de redondeo es exactamente 0.]{componente="NumericsLab"}
```yaml
modo: flotante
valor: 6.25
formato: float64
```
:::

## Propiedades

- **Error relativo acotado:** todo número dentro del rango se guarda con error relativo menor o igual que $\varepsilon/2$.
- **Separación proporcional al tamaño:** la distancia entre números consecutivos con exponente $e$ es $2^{e - p}$; se duplica cada vez que el exponente sube en uno.

:::figura[1000 en precisión simple: su exponente es 9 y la distancia al siguiente número representable es $2^{9 - 23} \approx 6.1 \times 10^{-5}$, unas 500 veces mayor que cerca de 0.1.]{componente="NumericsLab"}
```yaml
modo: flotante
valor: 1000
formato: float32
```
:::

- **Enteros exactos:** en precisión doble todo entero con valor absoluto hasta $2^{53}$ se representa sin error; en simple, hasta $2^{24} = 16777216$.
- **Fracciones exactas:** solo los números de la forma $m/2^k$ que caben en la mantisa se guardan sin error; $0.5$ y $0.375$ sí, $0.1$ y $1/3$ no.
- **Aritmética:** el resultado de cada operación básica es el valor exacto redondeado, $\mathrm{fl}(a \circ b) = (a \circ b)(1 + \delta)$, pero la suma de punto flotante no es asociativa.

## Errores comunes

- **Comparar con igualdad exacta.** $0.1 + 0.2 = 0.30000000000000004$ en doble, que no es el número que se guarda para $0.3$; se comparan con una tolerancia relativa.

:::figura[0.3 en precisión doble se guarda como $0.29999999999999998\ldots$, ligeramente por debajo, mientras que la suma $0.1 + 0.2$ da $0.30000000000000004$: dos números de punto flotante distintos aunque en decimal sean iguales.]{componente="NumericsLab"}
```yaml
modo: flotante
valor: 0.3
formato: float64
```
:::

- **Creer que más cifras impresas son más exactitud.** Imprimir 20 cifras de un número de precisión simple solo muestra el ruido del redondeo.
- **Sumar números de magnitudes muy distintas sin cuidado.** $10^{16} + 1 - 10^{16}$ da 0 en doble, porque el 1 cae por debajo de la separación entre números cercanos a $10^{16}$.
- **Pensar que el épsilon es el número positivo más pequeño.** El épsilon es la separación relativa cerca de 1; el positivo más pequeño, un subnormal, es muchísimo menor.

## Conexiones

Cada bit de la fracción aporta una potencia de $1/2$, y la mantisa es una suma parcial de una [[serie-geometrica]] binaria. El redondeo produce el [[error-de-redondeo-y-error-de-truncamiento]] y explica por qué importa la [[estabilidad-numerica]]. El [[truco-log-sum-exp]] existe para no salirse del rango de exponentes, y la [[diferenciacion-numerica]] pierde exactitud cuando el paso se acerca al épsilon.

## Formulario

:::formula[Número de punto flotante]
$$
x = (-1)^{s} \cdot \Big(1 + \sum_{i=1}^{p} f_i\, 2^{-i}\Big) \cdot 2^{e}
$$

- $s$: signo; $f_i$: bits de la fracción; $p$: número de bits de fracción; $e$: exponente.
:::

:::formula[Épsilon de máquina]
$$
\varepsilon = 2^{-p}, \qquad \varepsilon_{32} = 2^{-23} \approx 1.19 \times 10^{-7}, \qquad \varepsilon_{64} = 2^{-52} \approx 2.22 \times 10^{-16}
$$

- $p$: bits de fracción del formato.
:::

:::formula[Modelo del redondeo]
$$
\mathrm{fl}(x) = x(1 + \delta), \qquad |\delta| \le \frac{\varepsilon}{2}
$$

- $\mathrm{fl}(x)$: valor guardado; $\delta$: error relativo.
:::

:::formula[Separación entre números consecutivos]
$$
\mathrm{ulp}(x) = 2^{e - p}
$$

- $e$: exponente de $x$; $p$: bits de fracción.
:::
