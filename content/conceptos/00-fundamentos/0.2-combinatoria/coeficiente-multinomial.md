---
id: coeficiente-multinomial
titulo: Coeficiente multinomial
titulo_en: Multinomial coefficient
alias:
  - teorema multinomial
  - coeficiente trinomial
modulo: 0
submodulo: '0.2'
orden: 14
nivel: basico
prerrequisitos:
  - teorema-del-binomio
  - permutaciones-con-repeticion
etiquetas:
  - coeficiente multinomial
  - repartos
  - desarrollo de potencias
  - multiconjuntos
resumen: >
  El coeficiente multinomial n!/(k1! ... kr!) cuenta las formas de repartir n objetos distintos en r grupos
  etiquetados de tamaños k1, ..., kr, y es el coeficiente de x1^k1 ... xr^kr en (x1 + ... + xr)^n.
formula: '\binom{n}{k_1, \dots, k_r} = \frac{n!}{k_1!\cdots k_r!},\qquad (x_1 + \dots + x_r)^n = \sum \binom{n}{k_1, \dots, k_r} x_1^{k_1}\cdots x_r^{k_r}'
visualizacion:
  componente: PascalTriangle
  parametros:
    modo: multinomial
    n: 4
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Una empresa asigna 9 empleados nuevos a tres áreas: 4 a ventas, 3 a operaciones y 2 a finanzas. Se puede elegir primero a los 4 de ventas, $\binom{9}{4}$ maneras; luego a los 3 de operaciones entre los 5 que quedan, $\binom{5}{3}$; y los 2 restantes van a finanzas. El total es $\binom{9}{4}\binom{5}{3} = 126 \cdot 10 = 1260$. Al simplificar los factoriales queda $\frac{9!}{4!\,3!\,2!}$, el coeficiente multinomial.

El mismo número aparece al desarrollar $(x + y + z)^9$: el término $x^4y^3z^2$ surge cada vez que se elige $x$ en 4 de los 9 factores, $y$ en 3 y $z$ en 2, y cada una de esas elecciones es un reparto de los 9 factores en tres grupos. Es la extensión natural del coeficiente binomial, que corresponde al caso de dos grupos: los elegidos y los no elegidos.

## Definición

:::definicion[Coeficiente multinomial]
Para enteros $k_1, \dots, k_r \ge 0$ con $k_1 + \dots + k_r = n$,
$$
\binom{n}{k_1, k_2, \dots, k_r} = \frac{n!}{k_1!\,k_2!\cdots k_r!}.
$$
:::

Cuenta, de manera equivalente: los repartos de $n$ objetos distintos en $r$ grupos etiquetados con tamaños $k_1, \dots, k_r$; y las palabras de longitud $n$ con $k_i$ letras del tipo $i$.

:::teorema[Teorema multinomial]
$$
(x_1 + \dots + x_r)^n = \sum_{k_1 + \dots + k_r = n} \binom{n}{k_1, \dots, k_r} x_1^{k_1} \cdots x_r^{k_r},
$$
donde la suma recorre todas las $r$-tuplas de enteros no negativos con suma $n$.
:::

## Cómo usar la visualización

Cada celda del triángulo corresponde a un término $x^i y^j z^k$ de $(x + y + z)^n$ con $i + j + k = n$; la fila indica el exponente de $z$ y la posición dentro de la fila el de $y$. Su número es el coeficiente $\frac{n!}{i!\,j!\,k!}$ y su color es más intenso cuanto mayor es. La reproducción llena las celdas una por una y acumula la suma de coeficientes.

Al terminar, la suma es siempre $3^n$: con $n = 4$, $81$. Los bordes del triángulo, donde una de las variables no aparece, reproducen la fila $n$ del triángulo de Pascal. Los coeficientes más grandes quedan en el centro, donde los tres exponentes son parecidos.

## Ejemplo

Un dado se lanza 6 veces y se registra solo si sale 1, 2 o un número mayor que 2 (resultados A, B y C).

1. Las secuencias con exactamente 3 resultados A, 2 B y 1 C son $\frac{6!}{3!\,2!\,1!} = \frac{720}{12} = 60$.
2. El número total de secuencias de tres tipos de resultado es $3^6 = 729$, la suma de todos los coeficientes multinomiales con $n = 6$ y $r = 3$.
3. Con probabilidades $1/6$, $1/6$ y $4/6$ para A, B y C, la probabilidad de ese recuento es $60 \left(\tfrac{1}{6}\right)^3\left(\tfrac{1}{6}\right)^2\left(\tfrac{4}{6}\right) = \frac{60 \cdot 4}{6^6} = \frac{240}{46656} \approx 0.0051$.

## Propiedades

- **Producto de binomiales:** $\binom{n}{k_1, \dots, k_r} = \binom{n}{k_1}\binom{n - k_1}{k_2}\cdots\binom{k_r}{k_r}$.
- **Dos grupos:** $\binom{n}{k, n-k} = \binom{n}{k}$.
- **Suma total:** la suma de todos los coeficientes con $n$ y $r$ fijos es $r^n$.
- **Número de términos:** $(x_1 + \dots + x_r)^n$ tiene $\binom{n + r - 1}{r - 1}$ términos distintos, contados con estrellas y barras.
- **Recursión tipo Pascal:** $\binom{n}{k_1, \dots, k_r} = \sum_{i} \binom{n-1}{k_1, \dots, k_i - 1, \dots, k_r}$.

## Errores comunes

- **Olvidar que los grupos están etiquetados.** Si los grupos no tienen nombre y tienen el mismo tamaño, hay que dividir entre el número de formas de permutar los grupos iguales.
- **Usar exponentes que no suman $n$.** El coeficiente solo está definido cuando $k_1 + \dots + k_r = n$.
- **Confundir el número de términos con la suma de coeficientes.** Con $n = 4$ y $r = 3$ hay 15 términos, pero sus coeficientes suman 81.

## Conexiones

El coeficiente multinomial generaliza el [[coeficiente-binomial]] y el [[teorema-del-binomio]], y es el número de [[permutaciones-con-repeticion]] de un multiconjunto. Sus términos se cuentan con [[combinaciones-con-repeticion|estrellas y barras]]. En probabilidad, es la constante de la distribución multinomial, que describe los recuentos de resultados en ensayos independientes con más de dos resultados posibles.
